def get_files_from_init(container_order):
    files = ("empty", "matricula", "ventilation")
    return [
        {
            "filename": f"contenedor/{f}.jpeg",
            "file": getattr(container_order, f, None)
        } for f in files
    ]


def get_files_from_final(close_order):
    files = ("full", "semi_close", "close", "precinto")
    return [
        {
            "filename": f"contenedor/{f}.jpeg",
            "file": getattr(close_order, f, None)
        } for f in files
    ]


def get_files_from_rows(rows):
    return [
        {
            "filename": f"filas/${row.number}/image_product_${row.product.id}.jpeg",
            "file": getattr(row, "image")
        } for row in rows
    ]


def get_files_from_control(controls):
    return [
        {
            "filename": f"producto/${control.control}/${control.number}/image_${control.id}.jpeg",
            "file": getattr(control, "image")
        } for control in controls
    ]


def save_files_zip(zip_file, files, key="file", key_filename="filename"):
    for f in files:
        if (not f.get(key)):
            continue
        with f.get(key).open() as image:
            zip_file.writestr(
                f.get(key_filename), image.read()
            )
