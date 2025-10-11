import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

export const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-image">
          <img 
            src="https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg" 
            alt="404 Not Found" 
          />
        </div>
        <div className="not-found-text">
          <h1 className="not-found-title">¡Oops!</h1>
          <h2 className="not-found-subtitle">404 - Página no encontrada</h2>
          <p className="not-found-description">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/" className="btn-home">
            <i className="fas fa-home"></i> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};
