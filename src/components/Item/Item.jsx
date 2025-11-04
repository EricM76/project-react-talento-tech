import React from 'react'
import './Item.css'
import { toThousand } from '../../utils'

export const Item = ({ product }) => {
  const { id, name, price, discount, image } = product

  return (
    <section className="product-box">
      <figure className="product-box_image">
        <img src={image} alt="imagen de producto" />
      </figure>
      <article className="product-box_data">
        <h2>$ {toThousand(price)}</h2>
        {discount ? <span>{discount}% OFF</span> : null}
        <p>{name}</p>
        <i className="fas fa-truck"></i>
      </article>
    </section>
  )
}
