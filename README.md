# Grocery Store X
In this python project, we will build a grocery store management application. It will be 3 tier application,
1. Front end: UI is written in HTML/CSS/Javascript/Bootstrap
2. Backend: Python and Flask
3. Database: mysql

![](homepage.JPG)

### Installation Instructions

Download mysql for windows: https://dev.mysql.com/downloads/installer/

`pip install mysql-connector-python`

### Database Setup

1.  **Install MySQL**: Download and install MySQL from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/).
2.  **Create Database**: Create a database named `grocery_store`. You can do this using a MySQL client (like MySQL Workbench or the command line client) with the following command:
    ```sql
    CREATE DATABASE grocery_store;
    ```
3.  **User Permissions**: The application connects to MySQL using the username `root` and password `root` (as configured in `backend/sql_connection.py`). Ensure this user exists and has the necessary permissions on the `grocery_store` database. **Note:** For a production environment, it is strongly recommended to create a dedicated user with restricted permissions and use a more secure password management strategy.

### Running the Application

1.  **Install Dependencies**:
    ```bash
    pip install Flask mysql-connector-python
    ```
2.  **Start the Backend Server**:
    Navigate to the project's root directory in your terminal and run:
    ```bash
    python backend/server.py
    ```
    The server will start on `http://127.0.0.1:5000`.
3.  **Access the Frontend**:
    Open the `ui/index.html` file in your web browser.

### Exercise

The grocery management system that we built is functional but after we give it to users for use, we got following feedback. The exercise for you to address this feedback and implement these features in the application,
1. **Products Module**: In products page that lists current products, add an edit button next to delete button that allows to edit current product
2. **Products Module**: Implement a new form that allows you to add new UOM in the application. For example you want to add **Cubic Meter** as a new UOM as the grocery store decided to start selling **wood** as well. This requies changing backend (python server) and front end (UI) both.
3. **Orders Module**: When you place an order it doesn't have any validation. For example one can enter an order with empty customer name. You need to add validation for customer name and invalid item name or not specifying a quantity etc. This is only front end UI work.
4. **Orders Module**: In new order page there is a bug. When you manually change total price of an item it doesn't change the grand total. You need to fix this issue.
5. **Orders Module**: In the grid where orders are listed, add a view button in the last column. On clicking this button it should show you order details where individual items in that order are listed along with their price/quantity etc.

