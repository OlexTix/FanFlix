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
  const client = await poolDB.connect();

  try {
    // Get all products from the database
    const localProductsRes = await client.query('SELECT * FROM "Ticket_Type"');
    const localProducts = localProductsRes.rows;

    // Get all Stripe products
    const stripeProductsRes = await stripeGetRequest('/v1/products');
    const stripeProducts = stripeProductsRes.data;

    // Filter and transform products
    const filteredProducts = stripeProducts
      .map(stripeProduct => {
        // Find corresponding local product
        const localProduct = localProducts.find(
          product =>
            product.title === stripeProduct.name 
        );

        if (localProduct) {
          // If a matching local product is found, return the required fields
          return {
            id: stripeProduct.id,
            id_ticket_type: localProduct.id_ticket_type,
            stripePriceId: localProduct.stripePriceId,
            title: localProduct.title,
            price: localProduct.price,
            description: localProduct.description,
            image: localProduct.image,
            
            
          };
        }
      })
      .filter(Boolean); 

    res.status(200).send(filteredProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Failed to fetch products" });
  } finally {
    client.release();
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
      unit_amount: price * 100,  
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
  
    module.exports = {
        addTicket,
        getAllProducts,
      };