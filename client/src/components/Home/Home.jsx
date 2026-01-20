import React, { useEffect, useState } from "react";
import HomeStyle from "./Home.module.css";
import VegCard from "../../components/VegCard/VegCard";

const Home = () => {
  const [vegs, setVegs] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch("http://localhost:3000/api/products") 
      .then((res) => res.json())
      .then((data) => {
        setVegs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vegetables:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={HomeStyle.home}>
      <h2 className={HomeStyle.title}>Fresh Vegetables 🥬</h2>

      {loading ? (
        <p className={HomeStyle.loading}>Loading products...</p>
      ) : (
        <div className={HomeStyle.grid}>
          {vegs.map((veg) => (
            <VegCard key={veg._id || veg.name} veg={veg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
