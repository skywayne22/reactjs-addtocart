import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Box, Button } from "@mui/material";

export default function App() {
  const [products, setProductsData] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [clicked, setClicked] = useState(false);
  const baseURL = "http://127.0.0.1:5000/"

  useEffect(() => {
    populateData();
    getOrderList();
  }, []);

  const createCart = () => {
    if (!selectedSize) alert("Please choose size!");
    else {
      var exists = false;
      orderList.forEach((item) => {
        if (item.sizeLabel == selectedSize) {
          exists = true;
          return;
        }
      });

      if (exists) {
        updateOrder();
      } else {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          withCredentials: true,
          body: JSON.stringify({
            title: products.title,
            price: products.price,
            imageURL: products.imageURL,
            qty: 1,
            sizeLabel: selectedSize,
          }),
        };
        fetch(baseURL+"createCart", requestOptions).then(() => {
          getOrderList();
          alert("ORDER SAVED!");
        });
      }
    }
  };

  const getOrderList = () => {
    const requestOptions = {
      withCredentials: true,
  };
    axios.get(baseURL+"getCart", requestOptions).then((res) => {
      setOrderList(JSON.parse(res.data.orderList));
    });
  };

  const updateOrder = () => {
    const requestOptions = {
      withCredentials: true,
  };
    axios
      .get(baseURL+"updateCart?sizeLabel=" + selectedSize, requestOptions)
      .then((res) => {
        setOrderList(JSON.parse(res.data.orderList));
        alert("ORDER UPDATED!");
      });
  };

  const UI = () => {
    return (
      <Box
        sx={{
          width: "100%",
          height: "80%",
          display: "flex",
        }}
      >
        <Box sx={{ flex: "50%" }}>
          <img src={products.imageURL} height="80%"></img>
        </Box>
        <Box sx={{ flex: "50%" }}>
          <h3> {products.title}</h3>
          <h4> ${products.price}.00</h4>
          <h5>{products.description}</h5>
          <p>SIZE* {selectedSize}</p>
          {products.sizeOptions &&
            products.sizeOptions.map((size) => (
              <button key={size.id} onClick={() => setSelectedSize(size.label)}>
                {size.label}
              </button>
            ))}
          <button onClick={createCart}>ADD TO CART</button>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ background: "white", width: "100vw", height: "100vh" }}>
      <Box
        sx={{
          background: "gray",
          width: "100ww",
          height: 50,
          alignItems: "right",
        }}
      >
        <Button
          sx={{ right: "2%", position: "fixed", color: "white" }}
          onClick={() => {
            getOrderList();
            setClicked(!clicked);
          }}
        >
          My Cart
        </Button>
      </Box>
      {clicked && (
        <Box
          sx={{
            background: "white",
            border: "1px solid black",
            width: 200,
            position: "fixed",
            right: "2%",
          }}
        >
          {orderList.map((order, i) => (
            <Box
              key={i}
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            >
              <Box sx={{ flex: "50%" }}>
                <img
                  src={order.imageURL}
                  alt="Girl in a jacket"
                  width="100%"
                  height="80%"
                ></img>
              </Box>
              <Box sx={{ flex: "50%" }}>
                <p> {order.title}</p>
                <p>
                  {order.qty}x ${order.price}.00
                </p>
                <p> SIZE* {order.sizeLabel}</p>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <UI />
    </Box>
  );

  function populateData() {
    axios
      .get(
        "https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product",
        {}
      )
      .then((res) => {
        setProductsData(res.data);
      });
  }
}
