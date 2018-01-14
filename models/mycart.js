module.exports = function cart(olditems) {
    this.items = olditems.items || {},
        this.totalQty = olditems.totalQty || 0,
        this.totalprice = olditems.totalprice || 0

    this.addTocart = function(item, id) {
        let stored = this.items[id];

        if (!stored) {
            stored = this.items[id] = { item: item, price: 0, qty: 0 }
        }
        stored.qty++;
        stored.price = stored.item.price * stored.qty;
        this.totalQty++;
        this.totalprice += stored.item.price;
    }

    this.generateArray = function() {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }

    //reduce by 1

    this.reduceOne = function(id) {

        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalprice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }

    }

    this.additems = function(id) {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.price;
        this.totalprice += this.items[id].item.price;
        this.totalQty++;

    }


    this.removeall = function(id) {

        this.totalprice -= this.items[id].item.price;

        this.totalQty -= this.items[id].qty;
        delete this.items[id];
    }



}