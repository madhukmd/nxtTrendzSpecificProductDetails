// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const starIcon = 'https://assets.ccbp.in/frontend/react-js/star-img.png'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    productItem: '',
    similarItems: [],
    apiStatus: apiStatusConstants.initial,
    quantityCount: 1,
  }

  componentDidMount() {
    this.getProductItem()
  }

  getProductItem = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.loading,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const UpdatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachItem => ({
          availability: eachItem.availability,
          brand: eachItem.brand,
          description: eachItem.description,
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          price: eachItem.price,
          rating: eachItem.rating,
          title: eachItem.title,
          totalReviews: eachItem.total_reviews,
        })),
      }
      this.setState({
        productItem: UpdatedData,
        similarItems: UpdatedData.similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  quantityIncrement = () => {
    this.setState(prevState => ({quantityCount: prevState.quantityCount + 1}))
  }

  quantityDecrement = () => {
    const {quantityCount} = this.state
    if (quantityCount > 1) {
      this.setState(prevState => ({quantityCount: prevState.quantityCount - 1}))
    }
  }

  productItemView = () => {
    const {productItem, similarItems, quantityCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productItem
    return (
      <div className="productItem-bg-container">
        <div className="productItem-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="productItem-content-container">
            <h1 className="title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review-container">
              <div className="rating_container">
                <p className="rating">{rating}</p>
                <img src={starIcon} alt="star" className="rating-icon" />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="available-brand-container">
              <p className="available">Available: </p>
              <p className="available-sub">{availability}</p>
            </div>
            <div className="available-brand-container">
              <p className="brand">Brand: </p>
              <p className="brand-sub">{brand}</p>
            </div>
            <hr />
            <div className="count-icons">
              <button
                type="button"
                className="bs-button"
                onClick={this.quantityDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="bs" />
              </button>

              <p className="count">{quantityCount}</p>
              <button
                type="button"
                className="bs-button"
                onClick={this.quantityIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="bs" />
              </button>
            </div>
            <button type="button" className="add-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarItems.map(product => (
              <SimilarProductItem productItem={product} key={product.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  errorView = () => (
    <div className="productItem-failureView-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="errorView-image"
      />
      <h1 className="errorView-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="add-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductItem = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.productItemView()
      case apiStatusConstants.failure:
        return this.errorView()
      case apiStatusConstants.loading:
        return this.loadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductItem()}
      </>
    )
  }
}

export default ProductItemDetails
