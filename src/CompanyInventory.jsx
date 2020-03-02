class ProductTable extends React.Component {
    render() {
        const productRows = this.props.products.map(product =>
            <ProductRow product={product}/>
        );

        return (
            <div>
                <h4>Showing all available products</h4>
                <hr/>
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Image</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productRows}
                    </tbody>
                </table>
            </div>
        );
    }
}

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: []
        };
        this.createProduct = this.createProduct.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        /*setTimeout(() => {
            this.setState({products: []})
        }, 500);*/
        const query = `query {
            allProducts {
                id
                productName
                price
                category
                imageUrl
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const result = await response.json();
        this.setState({ products: result.data.allProducts });
    }

    async createProduct(product) {
        /*const newProductList = this.state.products.slice();
        newProductList.push(product);
        this.setState({products: newProductList});*/

        const query = `mutation addProduct($product: ProductInputs!) {
            addProduct(product: $product) {
                id
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { product } })
        });
        this.loadData();
    }

    render() {
        return (
            <React.Fragment>
                <h3>My Company Inventory</h3>
                <ProductTable products={this.state.products}/>
                <hr/>
                <ProductAdd createProduct={this.createProduct}/>
            </React.Fragment>
        );
    }
}

class ProductRow extends React.Component {
    render() {
        const product = this.props.product;

        return (
            <tr>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td><a href={product.imageUrl} target="_blank">View</a></td>
            </tr>
        );
    }
}

class ProductAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.productAdd;
        const product = {
            productName: form.productName.value,
            price: form.price.value,
            category: form.category.value,
            imageUrl: form.imageUrl.value,
        }
        this.props.createProduct(product);

        form.productName.value = "";
        form.price.value = "";
        form.category.value = "";
        form.imageUrl.value = "";
    }

    render() {
        return (
            <div>
                <h4>Add a new product to inventory</h4>
                <hr/>
                <form name="productAdd" onSubmit={this.handleSubmit}>
                    <table border="0">
                        <tr>
                            <td>
                                <label>Category</label><br/>
                                <select id="category" name="category">
                                    <option value="Shirts">Shirts</option>
                                    <option value="Jeans">Jeans</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Sweaters">Sweaters</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </td>
                            <td>
                                <label>Price Per Unit</label><br/>
                                <input type="text" name="price" placeholder="$" />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Product Name</label><br/>
                                <input type="text" name="productName" />
                            </td>
                            <td>
                                <label>Image URL</label><br/>
                                <input type="text" name="imageUrl" />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button name="submit">Add Product</button>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<ProductList/>, document.getElementById('contents'));