import { query } from '../config/database';

export const SweetModel = {
  async create(data: any) {
    const res = await query(
      'INSERT INTO sweets (name, category, price, quantity) VALUES ($1,$2,$3,$4) RETURNING *',
      [data.name, data.category, data.price, data.quantity]
    );
    return res.rows[0];
  },

  async findAll() {
    const res = await query('SELECT * FROM sweets');
    return res.rows;
  },

  async purchase(id: number) {
    const res = await query(
      `UPDATE sweets
       SET quantity = quantity - 1
       WHERE id = $1 AND quantity > 0
       RETURNING *`,
      [id]
    );
    return res.rows[0];
  },

  async restock(id: number, amount: number) {
    const res = await query(
      'UPDATE sweets SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
      [amount, id]
    );
    return res.rows[0];
  },

  async delete(id: number) {
    await query('DELETE FROM sweets WHERE id = $1', [id]);
  },

  async search(queryText: string) {
    const res = await query(
      `SELECT * FROM sweets
       WHERE LOWER(name) LIKE LOWER($1)`,
      [`%${queryText}%`]
    );
    return res.rows;
  },

  async update(id: number, data: any) {
    
  const res = await query(
    `UPDATE sweets
     SET name = $1,
         category = $2,
         price = $3,
         quantity = $4
     WHERE id = $5
     RETURNING *`,
    [data.name, data.category, data.price, data.quantity, id]
  );

  return res.rows[0];
}

};
