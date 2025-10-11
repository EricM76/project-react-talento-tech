import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import { toThousand } from "../../helpers";
import { useParams } from "react-router-dom";

export const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch(`/data/products.json`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data.find((product) => product.id === +id));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading product:", error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="container products-wrapper">
      {loading ? (
        <div className="alert alert-info">Cargando....</div>
      ) : (
        <>
      <div className="row">
        <div className="col-12">
          <h2 className="products-title">
            Detalle del producto: {product.name}
          </h2>
        </div>
      </div>
      <div className="product-detail">
        <div className="row">
          <div className="col-12 col-lg-8">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-img"
            />
          </div>
          <div className="col-12 col-lg-4">
            <article className="product-detail-info">
              <h2 className="product-detail-title">{product.name} </h2>
              {product.discount > 0 ? (
                <>
                  <p className="product-detail-price small">
                    <span>${product.price}</span>/<b>{product.discount}% OFF</b>
                  </p>
                  <p className="product-detail-price">$
                    {toThousand(
                      product.price - (product.price * product.discount) / 100
                    )}
                  </p>
                </>
              ) : (
                <p className="product-detail-price">$
                  {toThousand(product.price)}
                </p>
              )}

<p className="product-detail-description">{product.description}</p>
              <button
                className="btn btn-primary mb-3"
                style={{ width: "100%" }}
              >
                AGREGAR AL CARRITO
              </button>
            </article>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
