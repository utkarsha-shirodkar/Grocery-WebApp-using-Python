from sql_connection import get_sql_connection

def get_all_products(connection):
    cursor = connection.cursor()
    query = ("select products.product_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name from products inner join uom on products.uom_id=uom.uom_id")
    cursor.execute(query)
    response = []
    for (product_id, name, uom_id, price_per_unit, uom_name) in cursor:
        response.append({
            'product_id': product_id,
            'name': name,
            'uom_id': uom_id,
            'price_per_unit': price_per_unit,
            'uom_name': uom_name
        })
    return response


def get_product_by_name(connection, product_name):
    cursor = connection.cursor()
    query = ("SELECT product_id, name FROM products WHERE LOWER(TRIM(name)) = LOWER(%s)")
    cursor.execute(query, (product_name.strip(),))
    product = cursor.fetchone()
    cursor.close()
    return product


def get_product_by_id(connection, product_id):
    cursor = connection.cursor()
    query = ("select products.product_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name "
             "from products inner join uom on products.uom_id=uom.uom_id where products.product_id = %s")
    cursor.execute(query, (product_id,))
    product = cursor.fetchone()
    cursor.close()

    if product is None:
        return {}

    return {
        'product_id': product[0],
        'name': product[1],
        'uom_id': product[2],
        'price_per_unit': product[3],
        'uom_name': product[4]
    }


def insert_new_product(connection, product):
    product_name = (product.get('product_name') or '').strip()
    if not product_name:
        raise ValueError("Product name is required")

    existing_product = get_product_by_name(connection, product_name)
    if existing_product is not None:
        raise ValueError("Product already exists")

    cursor = connection.cursor()
    query = ("INSERT INTO products "
             "(name, uom_id, price_per_unit)"
             "VALUES (%s, %s, %s)")
    data = (product_name, product['uom_id'], product['price_per_unit'])

    cursor.execute(query, data)
    connection.commit()
    product_id = cursor.lastrowid
    cursor.close()

    return product_id


def update_product(connection, product):
    product_name = (product.get('product_name') or '').strip()
    if not product_name:
        raise ValueError("Product name is required")

    existing_product = get_product_by_name(connection, product_name)
    if existing_product is not None and int(existing_product[0]) != int(product['product_id']):
        raise ValueError("Product already exists")

    cursor = connection.cursor()
    query = ("UPDATE products "
             "SET name = %s, uom_id = %s, price_per_unit = %s "
             "WHERE product_id = %s")
    data = (product_name, product['uom_id'], product['price_per_unit'], product['product_id'])

    cursor.execute(query, data)
    connection.commit()
    cursor.close()

    return product['product_id']


def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = ("DELETE FROM products where product_id=" + str(product_id))
    cursor.execute(query)
    connection.commit()

    return cursor.lastrowid


if __name__ == '__main__':
    connection = get_sql_connection()
    # print(get_all_products(connection))
    print(insert_new_product(connection, {
        'product_name': 'potatoes',
        'uom_id': '1',
        'price_per_unit': 10
    }))