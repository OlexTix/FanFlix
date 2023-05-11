require("dotenv").config();
const Pool = require("pg").Pool;
const https = require('https');
const querystring = require('querystring');

const DATABASE_USER_NAME = process.env.DATABASE_USER_NAME;
const DATABASE_HOST_NAME = process.env.DATABASE_HOST_NAME;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;
const STRIPE_API_KEY = process.env.STRIPE_SECRET_KEY;

const DATABASE_LINK = `postgres://${DATABASE_USER_NAME}:${DATABASE_PASSWORD}@${DATABASE_HOST_NAME}:${DATABASE_PORT}/${DATABASE_NAME}?options=-c search_path=public`;

const connectionString = DATABASE_LINK;

const poolDB = new Pool({
  connectionString,
});

const getAllProducts = async (req, res) => {
    try {
      // Get all Stripe products
      const stripeProducts = await stripeGetRequest('/v1/products');
  
      res.status(200).send(stripeProducts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to fetch products" });
    }
  };

const addTicket = async (req, res) => {
  const client = await poolDB.connect();
  const { title, price, image, description } = req.body;

  try {
    // Create Stripe Product
    const stripeProduct = await stripePostRequest('/v1/products', {
      name: title,
      images: [image],
    });

    // Create Stripe Price
    const stripePrice = await stripePostRequest('/v1/prices', {
      unit_amount: price * 100,  // Convert PLN to smallest unit
      currency: 'pln',
      product: stripeProduct.id,
    });

    // Get Stripe Price
    const stripePriceId = stripePrice.id;
    const stripeGetPrice = await stripeGetRequest(`/v1/prices/${stripePriceId}`);

    // Add ticket to database
    const ticketQuery = 'INSERT INTO "Ticket_Type" (title, price, "stripePriceId", image, description) VALUES ($1, $2, $3, $4, $5)';
    const ticketValues = [title, price, stripeGetPrice.id, image, description];
    
    await client.query(ticketQuery, ticketValues);
    
    res.status(200).send({ message: "Ticket added successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to add ticket" });
  } finally {
    client.release();
  }
};

const modifyProduct = async (req, res) => {
    const { id_ticket } = req.params;
    const updates = req.body;
    
    try {
      // Update Stripe Product
      const updatedProduct = await stripePostRequest(`/v1/products/${id_ticket}`, updates);
  
      res.status(200).send(updatedProduct);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to update product" });
    }
  };
  
  const deleteProduct = async (req, res) => {
    const { id_ticket } = req.params;
  
    try {
      // Delete Stripe Product
      const deletedProduct = await stripeDeleteRequest(`/v1/products/${id_ticket}`);
  
      res.status(200).send(deletedProduct);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ message: "Failed to delete product" });
    }
  };



function stripeGetRequest(path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.stripe.com',
        path: path,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRIPE_API_KEY}`
        }
      };

      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            if (res.statusCode !== 200) {
              reject({
                message: `Stripe GET Request Failed with status code: ${res.statusCode}`,
                body: parsedData
              });
            } else {
              resolve(parsedData);
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.end();
    });
  }

function stripePostRequest(path, data) {
    return new Promise((resolve, reject) => {
    
      if (data.images) {
        data['images[]'] = data.images;
        delete data.images;
      }

      const postData = querystring.stringify(data);
      const options = {
        hostname: 'api.stripe.com',
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${STRIPE_API_KEY}`
        }
      };
  
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            if (res.statusCode !== 200) {
              console.error(`Stripe POST Request to ${path} Failed with status code: ${res.statusCode}`);
              console.error(parsedData);
              reject({
                message: `Stripe POST Request Failed with status code: ${res.statusCode}`,
                body: parsedData
              });
            } else {
              resolve(parsedData);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
  
      req.on('error', (e) => {
        reject(e);
      });
  
      req.write(postData);
      req.end();
    });
  }

  function stripeDeleteRequest(path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.stripe.com',
        path: path,
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${STRIPE_API_KEY}`
        }
      };
  
      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            if (res.statusCode !== 200) {
              reject({
                message: `Stripe DELETE Request Failed with status code: ${res.statusCode}`,
                body: parsedData
              });
            } else {
              resolve(parsedData);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
  
      req.on('error', (e) => {
        reject(e);
      });
  
      req.end();
    });
  }
  

  
    module.exports = {
        addTicket,
        getAllProducts,
        modifyProduct,
        deleteProduct,
      };