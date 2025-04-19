"use client";
import { useState } from "react";

export default function useFetch(fn) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await fn(...args);
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    setData,  // Add this line to expose setData
    fn: execute,
  };
}