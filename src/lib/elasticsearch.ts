import { Product } from "@/types/product";
import { Filters, Sort } from "@/types/search";
import { client, INDEX_NAME } from "./elastic";

export async function searchProducts(
  query: string,
  filters: Filters = {},
  sort: Sort = {},
  from = 0,
  size = 10
) {
  const must: Record<string, unknown>[] = [];
  const postFilterClauses: Array<Record<string, unknown>> = [];

  // Build the main query
  if (query) {
    must.push({
      multi_match: {
        query,
        fields: [
          "title^3",
          "description^2",
          "vendor",
          "tags",
          "productType",
          "seoTitle",
          "seoDescription",
        ],
        fuzziness: "AUTO",
        operator: "and",
      },
    });
  }

  // Build post-filter clauses for each filter
  const buildTermClause = (
    field: string,
    rawValues: string
  ): Record<string, unknown> => {
    const values = rawValues.split(",").map((val) => val.trim());

    if (values.length > 1) {
      return {
        bool: {
          should: values.map((val) => ({
            term: { [`${field}`]: val },
          })),
          minimum_should_match: 1,
        },
      };
    }
    return { term: { [`${field}`]: values[0] } };
  };

  if (filters.vendor) {
    postFilterClauses.push(buildTermClause("vendor.keyword", filters.vendor));
  }

  if (filters.productType) {
    postFilterClauses.push(buildTermClause("productType", filters.productType));
  }

  if (filters.tags) {
    postFilterClauses.push(buildTermClause("tags", filters.tags));
  }

  if (filters.status) {
    postFilterClauses.push(
      buildTermClause("status", filters.status.toUpperCase())
    );
  }

  if (filters.minPrice || filters.maxPrice) {
    const range: { gte?: number; lte?: number } = {};
    if (filters.minPrice != null) range.gte = filters.minPrice;
    if (filters.maxPrice != null) range.lte = filters.maxPrice;
    postFilterClauses.push({ range: { price: range } });
  }

  // Build the main search body
  const body: Record<string, unknown> = {
    query: {
      bool: {
        must: must.length ? must : [{ match_all: {} }],
      },
    },
    from,
    size,
    highlight: {
      fields: {
        title: {},
        description: {},
      },
    },
    aggs: {
      vendors: { terms: { field: "vendor.keyword", size: 20 } },
      productTypes: { terms: { field: "productType", size: 20 } },
      tags: { terms: { field: "tags", size: 40 } },
      priceRange: {
        range: {
          field: "price",
          ranges: [
            { key: "0-25", from: 0, to: 25 },
            { key: "25-50", from: 25, to: 50 },
            { key: "50-100", from: 50, to: 100 },
            { key: "100+", from: 100 },
          ],
        },
      },
    },
  };

  if (postFilterClauses.length) {
    body.post_filter = { bool: { filter: postFilterClauses } };
  }

  // Sorting
  let sortField = sort.field;
  if (sortField === "title") {
    sortField = "title.keyword";
  }
  if (sortField && sortField !== "relevance") {
    body.sort = [{ [sortField]: { order: sort.order || "asc" } }];
  }

  // Execute search
  try {
    const result = await client.search({ index: INDEX_NAME, body });
    return {
      products: result.hits.hits.map((hit) => {
        const source = hit._source as Product;
        return {
          id: source.id,
          title: source.title,
          handle: source.handle,
          vendor: source.vendor,
          tags: source.tags,
          image: source.image,
          price: source.price,
          status: source.status,
          totalInventory: source.totalInventory,
        };
      }),
      total:
        typeof result.hits.total === "object"
          ? result.hits.total.value
          : result.hits.total,
      aggregations: result.aggregations,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "ResponseError") {
        return {
          products: [],
          total: 0,
          aggregations: {},
        };
      }
    }
    throw error;
  }
}

export async function autocomplete(query: string, size = 5) {
  const result = await client.search({
    index: INDEX_NAME,
    body: {
      suggest: {
        title_suggest: {
          prefix: query,
          completion: {
            field: "title.completion",
            fuzzy: {
              fuzziness: "AUTO",
            },
            size,
          },
        },
      },
    },
  });

  const options = result.suggest?.title_suggest?.[0]?.options;
  return Array.isArray(options)
    ? (options as Array<{ _source: Product }>).map((option) => option._source)
    : [];
}

export async function getProductByHandle(handle: string) {
  const result = await client.search({
    index: INDEX_NAME,
    body: {
      query: {
        term: { handle },
      },
    },
  });

  if (result.hits.hits.length === 0) {
    return null;
  }

  const product = result.hits.hits[0]._source as Product;
  return product;
}
