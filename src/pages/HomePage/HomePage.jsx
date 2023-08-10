import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const App = () => {
  //STATE
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [ports, setPorts] = useState([]);
  const [selectedPort, setSelectedPort] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);

  //FUNCTIONAL
  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `https://financed.4netps.co.id/ujian/negaras`
      );
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchPorts = async (countryId) => {
    try {
      const response = await axios.get(
        `https://financed.4netps.co.id/ujian/pelabuhans?filter={"where":{"negaraId": ${countryId}}}`
      );
      setPorts(response.data);
    } catch (error) {
      console.error("Error fetching ports:", error);
    }
  };

  const fetchProducts = async (portId) => {
    try {
      const response = await axios.get(
        `https://financed.4netps.co.id/ujian/barangs?filter={"where":{"pelabuhanId": ${portId}}}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const calculateTotal = useCallback(() => {
    if (selectedProduct && price) {
      const totalPrice = parseFloat(price) * (1 - parseFloat(discount) / 100);
      setTotal(totalPrice);
    }
  }, [discount, price, selectedProduct]);

  //EFFECT
  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [selectedProduct, price, discount, calculateTotal]);

  //COMPONENT
  return (
    <div className="pl-56 pr-56 pt-20 w-full">
      <div className="flex justify-center text-5xl font-bold">
        <h1>PT. 4Net Prima Solusi</h1>
      </div>
      <div className="pt-20">
        <label htmlFor="country" className="block font-bold mb-1">
          Negara
        </label>
        <select
          id="country"
          className="w-full border rounded px-3 py-2"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            fetchPorts(e.target.value);
          }}
        >
          <option value="">Pilih Negara</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.negara}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="port" className="block font-bold mb-1">
          Pelabuhan
        </label>
        <select
          id="port"
          className="w-full border rounded px-3 py-2"
          value={selectedPort}
          onChange={(e) => {
            setSelectedPort(e.target.value);
            fetchProducts(e.target.value);
          }}
        >
          <option value="">Pilih Pelabuhan</option>
          {ports.map((port) => (
            <option key={port.id} value={port.id}>
              {port.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="product" className="block font-bold mb-1">
          Barang
        </label>
        <select
          id="product"
          className="w-full border rounded px-3 py-2"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Pilih Barang</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="discount" className="block font-bold mb-1">
          Diskon (%)
        </label>
        <input
          type="number"
          id="discount"
          className="w-full border rounded px-3 py-2"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="price" className="block font-bold mb-1">
          Harga
        </label>
        <input
          type="text"
          id="price"
          className="w-full border rounded px-3 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="block font-bold mb-1">Total</label>
        <p className="border rounded px-3 py-2 bg-gray-100">{`Rp. ${total.toFixed(
          2
        )}`}</p>
      </div>
    </div>
  );
};

export default App;
