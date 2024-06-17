// src/hocs/withLoading.js
import React, { useState, useEffect } from "react";

const withLoading = (WrappedComponent, fetchData) => {
  return (props) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await fetchData();
          setData(result);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <WrappedComponent data={data} {...props} />;
  };
};

export default withLoading;
