export const Selectors = {
    buttons: {
        add_package: ".btn.btn-md.btn-secondary.inline",
        restart_shipment: ".dicon-redo",
    },
    inputs: {
        from_contact: ".shipment-container.from input[name=query]",
        to_contact: ".shipment-container.to input[name=query]",

        //REFERNCES:
        employee: ".kv-inputs div:nth-child(1) input:nth-child(2)",
        invoice: ".kv-inputs div:nth-child(2) input:nth-child(2)",
        purchase_order: ".kv-inputs div:nth-child(3) input:nth-child(2)",
        pre_sold_order: ".kv-inputs div:nth-child(4) input:nth-child(2)",

    },
    divs: {
        wizard_container: ".shipping-wizzard",
        wizard_selector: "div.side-bar > div.menu-item.hover-over.shipping > span > div.sub-routes > div:nth-child(2)",
        shipping_sidebar: "div.side-bar > div.menu-item.hover-over.shipping",
        contact: ".contact-entry-item",
        from_selected: ".address-bubble.active",
        to_selected: ".address-bubble.orange-active",
    },
    spans: {
        metric: "div.control-toggle.weight > span > span:nth-child(2)",
        imperial: "div.control-toggle.weight > span > span:nth-child(1)",
    },
    
    byName: {
        // Shipment
        payment_type: "payment_type",
        billing_account: "billing_account",

        // Package
        package_type: "type",
        package_quantity: "quantity",
        package_width: "width",
        package_height: "height",
        package_length: "length",
        package_weight: "weight",
        instructions: "instructions",
        service_type: "service_type",

        // Pickup
        date: "pickup_date",
        point: "pickup_point",
        ready_by: "pickup_ready_by",
        closing_time: "pickup_closing_time",

    },
}