import { useState, useEffect } from "react";

export default (service, { params, conditions = true }, deps) => {
  const [response, setResponse] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (conditions) {
      const fetchMePlease = async () => {
        setIsLoading(true);
        try {
          const res = await service(...params);
          setResponse(res);
        } catch (error) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMePlease();
    }
  }, deps || []);

  return { response, error, isLoading };
};
