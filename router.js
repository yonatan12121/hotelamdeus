// router.js
const { API_KEY, API_SECRET } = require("./config");
const Amadeus = require("amadeus");
const express = require("express");

// Create router
const router = express.Router();
// Create Amadeus API client
const amadeus = new Amadeus({
  clientId: API_KEY,
  clientSecret: API_SECRET,
});


router.get(`/search`, async (req, res) => {
  const { keyword } = req.query;
  const response = await amadeus.referenceData.locations.get({
    keyword,
    subType: Amadeus.location.city,
  });
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});

// Location search suggestions
router.get(`/search-location`, async (req, res) => {
  try {
    const { keyword, pageLimit, pageOffset } = req.query;
    const response = await amadeus.referenceData.locations.get({
      'keyword': keyword,
      'page[limit]': pageLimit,
      'page[offset]': pageOffset,
      subType: Amadeus.location.city,
    });

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Querying hotels in a city
router.get(`/hotels`, async (req, res) => {
  const { cityCode } = req.query;
  const response = await amadeus.referenceData.locations.hotels.byCity.get({
    cityCode,
  });
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});

// Querying hotel offers
router.get(`/hotel-offers`, async (req, res) => {
  try {
    const { hotelIds } = req.query;
    const response = await amadeus.shopping.hotelOffersByHotel.get({
      hotelIds,
    });

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

router.get(`/offers`, async (req, res) => {
  const { hotelId } = req.query;
  const response = await amadeus.shopping.hotelOffersByHotel.get({
    hotelId,
  });
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
    
  }
});

// Get hotel offer details
router.get(`/hotel-offer`, async (req, res) => {
  try {
    const { offerId } = req.query;
    const response = await amadeus.shopping.hotelOffer(offerId).get();

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Booking
router.post(`/book-hotel`, async (req, res) => {
  try {
    const { data} = req.body;
    console.log(data.offerId);
    var offerId =data.offerId;
    var guests= data.guests;
    var payments= data.payments;
    const response = await amadeus.booking.hotelBookings.post(
      JSON.stringify({
        data: {
          offerId,
          guests,
          payments,
        },
      })
    );

    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

router.post(`/booking`, async (req, res) => {
  // const { offerId } = req.query;
  const { body } = req;
  console.log(body);
  const response = await amadeus.booking.hotelBookings.post(
    JSON.stringify({
      data: {
        offerId:body.offerId,
        guests: body.guests,
        payments: body.payments,
      },
    })
  );
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});


module.exports = router;