class CartMiddleware {
  static validateCart = (req, res, next) => {
    const { quantity, bookId } = req.body;
    var err = [];
    if (!quantity || !bookId) {
      err.push(`
        ${'quantity, ' && !quantity}
        ${'productId, ' && !bookId}
        do not exist
      `);
    }

    if (quantity <= 0) {
      err.push(`quantity(${quantity}) must be over 0`);
    }
    
    if (err) {
      res.status(400).json({ error: err });
    }
    
    next();
  }
}

export default CartMiddleware;