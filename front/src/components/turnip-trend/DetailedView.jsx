import React, { useEffect, useState } from "react";

const DetailedView = ({ pseudo }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {

    } catch (err) {

    } finally {

    }
  }, []);

  return (
    <div>
      {
        isLoading ? 'Chargement' : {pseudo}
      }
    </div>
  );
};

export default DetailedView;
