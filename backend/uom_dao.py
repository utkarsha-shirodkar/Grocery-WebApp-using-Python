
def get_uoms(connection):
    cursor = connection.cursor()
    query = ("select * from uom")
    cursor.execute(query)
    response = []
    for (uom_id, uom_name) in cursor:
        response.append({
            'uom_id': uom_id,
            'uom_name': uom_name
        })
    return response


def get_uom_by_name(connection, uom_name):
    cursor = connection.cursor()
    query = ("SELECT uom_id, uom_name FROM uom WHERE LOWER(TRIM(uom_name)) = LOWER(%s)")
    cursor.execute(query, (uom_name.strip(),))
    uom = cursor.fetchone()
    cursor.close()
    return uom


def insert_new_uom(connection, uom):
    uom_name = (uom.get('uom_name') or '').strip()
    if not uom_name:
        raise ValueError("UOM name is required")

    existing_uom = get_uom_by_name(connection, uom_name)
    if existing_uom is not None:
        raise ValueError("UOM already exists")

    cursor = connection.cursor()
    query = ("INSERT INTO uom (uom_name) VALUES (%s)")
    data = (uom_name,)

    cursor.execute(query, data)
    connection.commit()
    uom_id = cursor.lastrowid
    cursor.close()

    return uom_id


if __name__ == '__main__':
    from sql_connection import get_sql_connection

    connection = get_sql_connection()
    # print(get_all_products(connection))
    print(get_uoms(connection))