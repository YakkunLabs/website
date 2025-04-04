import React from 'react';
import './Store.css';
import nft_01 from '../assets/nft_01.png';
import nft_02 from '../assets/nft_02.png';
import nft_03 from '../assets/nft_03.png';
import nft_04 from '../assets/nft_04.png';
import nft_05 from '../assets/nft_05.png';
import nft_06 from '../assets/nft_06.png';

const products = [
  { image: nft_01, title: "NFT Item 1", price: "$50", discount: "10%" },
  { image: nft_02, title: "NFT Item 2", price: "$75", discount: "15%" },
  { image: nft_03, title: "NFT Item 3", price: "$100", discount: "5%" },
  { image: nft_04, title: "NFT Item 4", price: "$200", discount: "20%" },
  { image: nft_05, title: "NFT Item 5", price: "$150", discount: "12%" },
  { image: nft_06, title: "NFT Item 6", price: "$80", discount: "8%" },
];

const Store = () => {
  return (
    <div className="store-page">
      <div className="store-header">
        <h1>Exclusive NFT Collection</h1>
        <p>Discover and purchase unique NFTs for your digital collection.</p>
      </div>

      <div className="products-container">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">{product.price}</p>
              <p className="product-discount">{product.discount} OFF</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
