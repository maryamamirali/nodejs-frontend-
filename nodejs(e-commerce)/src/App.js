'use client'

import React, { useState, useEffect } from 'react'
import './App.css' // Import the CSS file if you place styles separately

export default function ProductManagement() {
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ title: '', description: '', price: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://ecommerce-website-backend-with-nod-js-and-mongodb.vercel.app/products/')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data.data)
    } catch (error) {
      setError('Failed to fetch products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('https://ecommerce-website-backend-with-nod-js-and-mongodb.vercel.app/products/addproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      if (!response.ok) throw new Error('Failed to create product')

      const result = await response.json()
      if (result.message === 'Product added successfully!') {
        setProducts([...products, { ...newProduct, id: result.id }])
        setNewProduct({ title: '', description: '', price: '' })
        setError(null)
      }
    } catch (error) {
      setError('Failed to add product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Product Management</h1>

        {error && (
          <div className="error-message">
            <span className="error-title">Error:</span> {error}
          </div>
        )}

        <div className="form-container">
          <h2 className="subtitle">Add New Product</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <div className="input-field">
                <label htmlFor="title" className="label">Product Title</label>
                <input
                  type="text"
                  id="title"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="input"
                  placeholder="Enter product title"
                  required
                />
              </div>
              <div className="input-field">
                <label htmlFor="price" className="label">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="input"
                  placeholder="Enter product price"
                  required
                />
              </div>
            </div>
            <div className="input-field">
              <label htmlFor="description" className="label">Product Description</label>
              <textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="input textarea"
                placeholder="Enter product description"
                required
              />
            </div>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="subtitle">Product List</h2>
          {loading && !products.length ? (
            <div className="loading-spinner"></div>
          ) : products.length > 0 ? (
            <div className="product-list">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products">No products available</p>
          )}
        </div>
      </div>
    </div>
  )
}

