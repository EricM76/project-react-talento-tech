import React, { useState, useEffect } from "react";
import "./Home.css";
import { BannerHome } from "../../components/BannerHome";
import { ItemListContainer } from "../../components/ItemListContainer/ItemListContainer";

export const Home = () => {

  return (
    <>
    <BannerHome/>
    <ItemListContainer title="Últimos agregados" filter="visited"/>
    <ItemListContainer title="Ofertas" filter="in-sale"/>
    </>
  );
};
