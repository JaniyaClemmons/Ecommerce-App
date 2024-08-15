# E-Commerce MERN Application

## Overview

This is a full-stack e-commerce application built with the MERN stack. It includes features for user authentication, product listings, a shopping cart, and order management. This project demonstrates the integration of MongoDB, Express.js, React.js, and Node.js in a real-world application.

## Features

- User Authentication: Register, login, and admin manage user accounts.
- Product Management: View and filter products, review products, and admin add new products.
- Shopping Cart: Add and remove products, view cart items, and checkout.
- Order Management: view order history and order details.

## Technologies Used

- Frontend: React.js, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens), bcrypt.js
- Styling: CSS, Bootstrap

## Installation

### Prerequisites

- Node.js and npm (Node Package Manager) installed.
- MongoDB server running or a MongoDB Atlas account.

### Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add the following environment variables:

    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4. Start the server:

    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm start
    ```

The application should now be running on `http://localhost:3000`.

## Usage

1. User Registration and Login: Access the authentication routes to register or log in.
2. Browse Products: Navigate to the product listing page to view available products.
3. Shopping Cart: Add products to the cart and proceed to checkout.
4. Admin Users:
    Add new products
    Order Management: View and manage orders, payments, and shipping status 

## Contributing

If you would like to contribute to this project:

1. Fork the repository.
2. Create a new branch:

    ```bash
    git checkout -b feature/your-feature
    ```

3. Make your changes and commit them:

    ```bash
    git add .
    git commit -m "Add feature"
    ```

4. Push to the branch:

    ```bash
    git push origin feature/your-feature
    ```

5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspiration for this project came from various e-commerce platforms.
- Thanks to the open-source community for providing tools and libraries that made development easier.
