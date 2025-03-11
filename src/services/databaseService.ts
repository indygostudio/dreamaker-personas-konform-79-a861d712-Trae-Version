import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Type for database query options
 */
interface QueryOptions {
  /**
   * Whether to throw an error on failure (default: true)
   */
  throwOnError?: boolean;
  
  /**
   * Custom error message
   */
  errorMessage?: string;
}

/**
 * Type for query result
 */
interface QueryResult<T> {
  data: T | null;
  error: PostgrestError | null;
  success: boolean;
}

/**
 * Service for handling database operations with Supabase
 */
export const databaseService = {
  /**
   * Execute a database query with error handling
   * @param queryFn Function that executes the query
   * @param options Query options
   * @returns Query result
   */
  async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    const { throwOnError = true, errorMessage } = options;
    
    try {
      const { data, error } = await queryFn();
      
      if (error && throwOnError) {
        console.error(errorMessage || 'Database query error:', error);
        throw error;
      }
      
      return { data, error, success: !error };
    } catch (err) {
      console.error(errorMessage || 'Error executing query:', err);
      if (throwOnError) throw err;
      return { data: null, error: err as PostgrestError, success: false };
    }
  },

  /**
   * Fetch a single record by ID
   * @param table Table name
   * @param id Record ID
   * @param options Query options
   * @returns Query result
   */
  async getById<T>(table: string, id: string, options: QueryOptions = {}): Promise<QueryResult<T>> {
    return this.executeQuery<T>(
      () => supabase.from(table).select('*').eq('id', id).single(),
      options
    );
  },

  /**
   * Fetch multiple records with optional filters
   * @param table Table name
   * @param filters Object with column-value pairs for filtering
   * @param options Query options
   * @returns Query result
   */
  async getMany<T>(
    table: string, 
    filters: Record<string, any> = {}, 
    options: QueryOptions & {
      select?: string;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<QueryResult<T[]>> {
    return this.executeQuery<T[]>(() => {
      let query = supabase.from(table).select(options.select || '*');
      
      // Apply filters
      Object.entries(filters).forEach(([column, value]) => {
        query = query.eq(column, value);
      });
      
      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      }
      
      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      return query;
    }, options);
  },

  /**
   * Insert a new record
   * @param table Table name
   * @param data Record data
   * @param options Query options
   * @returns Query result
   */
  async insert<T>(
    table: string, 
    data: Record<string, any>, 
    options: QueryOptions & { returning?: boolean } = {}
  ): Promise<QueryResult<T>> {
    const { returning = true } = options;
    
    return this.executeQuery<T>(() => {
      let query = supabase.from(table).insert(data);
      if (returning) query = query.select().single();
      return query;
    }, options);
  },

  /**
   * Update an existing record
   * @param table Table name
   * @param id Record ID
   * @param data Update data
   * @param options Query options
   * @returns Query result
   */
  async update<T>(
    table: string, 
    id: string, 
    data: Record<string, any>, 
    options: QueryOptions & { returning?: boolean } = {}
  ): Promise<QueryResult<T>> {
    const { returning = true } = options;
    
    return this.executeQuery<T>(() => {
      let query = supabase.from(table).update(data).eq('id', id);
      if (returning) query = query.select().single();
      return query;
    }, options);
  },

  /**
   * Delete a record
   * @param table Table name
   * @param id Record ID
   * @param options Query options
   * @returns Query result
   */
  async delete<T>(
    table: string, 
    id: string, 
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    return this.executeQuery<T>(
      () => supabase.from(table).delete().eq('id', id).select().single(),
      options
    );
  },

  /**
   * Execute a custom query
   * @param queryBuilder Function that builds and returns a query
   * @param options Query options
   * @returns Query result
   */
  async customQuery<T>(
    queryBuilder: (supabase: typeof supabase) => Promise<{ data: T | null; error: PostgrestError | null }>,
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    return this.executeQuery<T>(
      () => queryBuilder(supabase),
      options
    );
  }
};