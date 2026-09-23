// Auto-generated seed data for BiteHub backend server
export const restaurants = [
  {
    "id": "R001",
    "name": "Spice Route",
    "description": "A culinary journey through the aromatic spice trails of India, offering authentic North Indian and Mughlai cuisine crafted with traditional recipes.",
    "coverImage": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80",
    "cuisines": [
      "North Indian",
      "Mughlai",
      "Biryani"
    ],
    "rating": 4.6,
    "reviewCount": 1248,
    "priceForTwo": 600,
    "deliveryTime": 35,
    "deliveryFee": 30,
    "distance": "1.2 km",
    "address": "14 MG Road, Koregaon Park, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "11:00",
      "close": "23:00",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O1",
        "label": "50% OFF",
        "description": "50% off up to ₹100",
        "code": "SPICE50",
        "discount": 50,
        "type": "percent",
        "minOrder": 199
      },
      {
        "id": "O2",
        "label": "Free Delivery",
        "description": "Free delivery on orders above ₹299",
        "code": "FREESR",
        "discount": 0,
        "type": "flat"
      }
    ],
    "isVegetarian": false,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Starters",
      "Main Course",
      "Biryani",
      "Breads",
      "Desserts",
      "Beverages"
    ],
    "menuItems": [
      {
        "id": "M001",
        "restaurantId": "R001",
        "name": "Chicken Tikka",
        "description": "Succulent chicken marinated in yogurt and spices, grilled in tandoor",
        "price": 299,
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/31/Chicken_tikka_in_Araku_Valley%2C_Andhra_Pradesh_01.jpg",
        "category": "Starters",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M002",
        "restaurantId": "R001",
        "name": "Paneer Tikka",
        "description": "Fresh cottage cheese cubes marinated in spices and grilled to perfection",
        "price": 249,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Panir_Tikka_Indian_cheese_grilled.jpg",
        "category": "Starters",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Veg",
          "Bestseller"
        ]
      },
      {
        "id": "M003",
        "restaurantId": "R001",
        "name": "Dal Makhani",
        "description": "Slow-cooked black lentils in a rich tomato and butter gravy",
        "price": 229,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Dal_Makhani.jpg",
        "category": "Main Course",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M004",
        "restaurantId": "R001",
        "name": "Butter Chicken",
        "description": "Tender chicken in a velvety tomato-butter-cream sauce",
        "price": 319,
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Chicken_makhani.jpg",
        "category": "Main Course",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M005",
        "restaurantId": "R001",
        "name": "Chicken Biryani",
        "description": "Aromatic basmati rice cooked with spiced chicken and saffron",
        "price": 349,
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/23/A_home_made_plate_of_mutton_biryani_served_with_chicken_kassa_cooked_in_the_bengali_style.jpg",
        "category": "Biryani",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M006",
        "restaurantId": "R001",
        "name": "Garlic Naan",
        "description": "Soft tandoor-baked flatbread topped with garlic and butter",
        "price": 59,
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/81/Garlic_naan_1.jpg",
        "category": "Breads",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M007",
        "restaurantId": "R001",
        "name": "Gulab Jamun",
        "description": "Soft milk-solid dumplings soaked in rose-flavored sugar syrup",
        "price": 99,
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/58/Two_Gulab_Jamun_in_a_plate_01.jpg",
        "category": "Desserts",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M008",
        "restaurantId": "R001",
        "name": "Mango Lassi",
        "description": "Chilled yogurt drink blended with fresh mango",
        "price": 89,
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5e/Mango_Lassi_and_Butter_Milk_-_Vel_South_Indian_Kitchen_%2B_Bar.jpg",
        "category": "Beverages",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M009",
        "restaurantId": "R001",
        "name": "Mutton Rogan Josh",
        "description": "Slow-cooked mutton in Kashmiri spices with aromatic whole spices",
        "price": 389,
        "image": "https://images.unsplash.com/photo-1545247181-516773cae754?w=500&q=80",
        "category": "Main Course",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M010",
        "restaurantId": "R001",
        "name": "Veg Biryani",
        "description": "Fragrant basmati rice cooked with seasonal vegetables and spices",
        "price": 249,
        "image": "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?w=500&q=80",
        "category": "Biryani",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R002",
    "name": "The Bombay Tiffin",
    "description": "Bringing you the vibrant street flavors of Mumbai — from vada pav to pav bhaji — in a cozy, nostalgic setting.",
    "coverImage": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80",
    "cuisines": [
      "Street Food",
      "Maharashtra",
      "Snacks"
    ],
    "rating": 4.4,
    "reviewCount": 876,
    "priceForTwo": 300,
    "deliveryTime": 25,
    "deliveryFee": 20,
    "distance": "0.8 km",
    "address": "7 FC Road, Shivajinagar, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "08:00",
      "close": "22:00",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O3",
        "label": "30% OFF",
        "description": "30% off on orders above ₹149",
        "code": "TIFFIN30",
        "discount": 30,
        "type": "percent",
        "minOrder": 149
      }
    ],
    "isVegetarian": true,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Breakfast",
      "Snacks",
      "Meals",
      "Beverages"
    ],
    "menuItems": [
      {
        "id": "M011",
        "restaurantId": "R002",
        "name": "Vada Pav",
        "description": "Mumbai's iconic spiced potato fritter in a soft bun with chutneys",
        "price": 45,
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Crunchy_Crispy_Vada_pav.jpg",
        "category": "Snacks",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Iconic"
        ]
      },
      {
        "id": "M012",
        "restaurantId": "R002",
        "name": "Pav Bhaji",
        "description": "Spiced mixed vegetable mash served with buttered pav",
        "price": 149,
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Pav_bhaji_SWW.jpg",
        "category": "Meals",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M013",
        "restaurantId": "R002",
        "name": "Misal Pav",
        "description": "Spicy sprouted moth beans curry topped with farsan, served with pav",
        "price": 119,
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/ab/%2AMisal_Pav%2A.jpg",
        "category": "Breakfast",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M014",
        "restaurantId": "R002",
        "name": "Poha",
        "description": "Flattened rice tempered with mustard, curry leaves, onion and lemon",
        "price": 79,
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/5d/Poha_with_tomato_sause.jpg",
        "category": "Breakfast",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M015",
        "restaurantId": "R002",
        "name": "Bhel Puri",
        "description": "Puffed rice tossed with vegetables, chutneys and sev",
        "price": 69,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/97/Bhel_puri_chat%2C_photographed_in_West_Bengal%2C_India%2C_September_24%2C_2024.jpg",
        "category": "Snacks",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M016",
        "restaurantId": "R002",
        "name": "Dabeli",
        "description": "Sweet and spicy potato filling in pav with pomegranate and sev",
        "price": 55,
        "image": "https://upload.wikimedia.org/wikipedia/commons/4/47/Kachchi_Dabeli.jpg",
        "category": "Snacks",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M017",
        "restaurantId": "R002",
        "name": "Cutting Chai",
        "description": "Strong half-cup Mumbai-style tea — a true classic",
        "price": 25,
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/30/Cutting_Chai_%28Tea%29.jpg",
        "category": "Beverages",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M018",
        "restaurantId": "R002",
        "name": "Thali (Full Meals)",
        "description": "Complete Maharashtrian meal with rice, dal, bhaji, roti, papad, pickles",
        "price": 199,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/92/Thali_2.jpg",
        "category": "Meals",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R003",
    "name": "Wok & Bowl",
    "description": "Authentic Asian flavors — Chinese, Thai, and Japanese dishes — crafted fresh with premium ingredients.",
    "coverImage": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&q=80",
    "cuisines": [
      "Chinese",
      "Thai",
      "Asian"
    ],
    "rating": 4.3,
    "reviewCount": 654,
    "priceForTwo": 500,
    "deliveryTime": 40,
    "deliveryFee": 35,
    "distance": "2.1 km",
    "address": "22 Baner Road, Baner, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "12:00",
      "close": "23:00",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O4",
        "label": "₹75 OFF",
        "description": "Flat ₹75 off on orders above ₹399",
        "code": "WOK75",
        "discount": 75,
        "type": "flat",
        "minOrder": 399
      }
    ],
    "isVegetarian": false,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Starters",
      "Soups",
      "Noodles",
      "Rice",
      "Main Course",
      "Desserts"
    ],
    "menuItems": [
      {
        "id": "M019",
        "restaurantId": "R003",
        "name": "Veg Spring Rolls",
        "description": "Crispy rolls stuffed with mixed vegetables and glass noodles",
        "price": 149,
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/21/Veg_spring_roll.jpg",
        "category": "Starters",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M020",
        "restaurantId": "R003",
        "name": "Chicken Dim Sum",
        "description": "Steamed chicken dumplings with soy-ginger dipping sauce",
        "price": 199,
        "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80",
        "category": "Starters",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M021",
        "restaurantId": "R003",
        "name": "Hot & Sour Soup",
        "description": "Classic tangy and spicy soup with mushrooms and tofu",
        "price": 149,
        "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80",
        "category": "Soups",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M022",
        "restaurantId": "R003",
        "name": "Kung Pao Chicken",
        "description": "Wok-tossed chicken with peanuts, dried chilies and vegetables",
        "price": 299,
        "image": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80",
        "category": "Main Course",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M023",
        "restaurantId": "R003",
        "name": "Veg Hakka Noodles",
        "description": "Stir-fried noodles with crisp vegetables in Indo-Chinese style",
        "price": 199,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Hakka_Noodles%2C_Veg_Manchurian_PK009.jpg",
        "category": "Noodles",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M024",
        "restaurantId": "R003",
        "name": "Chicken Fried Rice",
        "description": "Wok-tossed rice with egg, chicken and spring onions",
        "price": 249,
        "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80",
        "category": "Rice",
        "isVegetarian": false,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M025",
        "restaurantId": "R003",
        "name": "Honey Chilli Potato",
        "description": "Crispy potato strips tossed in sweet-spicy honey chilli sauce",
        "price": 179,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/96/Honey_chilli_potato_2.jpg",
        "category": "Starters",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M026",
        "restaurantId": "R003",
        "name": "Thai Green Curry",
        "description": "Creamy coconut milk curry with vegetables, lemongrass, and kaffir lime",
        "price": 279,
        "image": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&q=80",
        "category": "Main Course",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R004",
    "name": "Curry Leaf",
    "description": "Celebrating the rich and diverse culinary heritage of South India — from crispy dosas to fragrant sambhar.",
    "coverImage": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80",
    "cuisines": [
      "South Indian",
      "Kerala",
      "Tamil"
    ],
    "rating": 4.7,
    "reviewCount": 1532,
    "priceForTwo": 350,
    "deliveryTime": 30,
    "deliveryFee": 25,
    "distance": "1.5 km",
    "address": "55 Aundh Road, Aundh, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "07:00",
      "close": "22:30",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O5",
        "label": "40% OFF",
        "description": "40% off up to ₹80",
        "code": "CURRY40",
        "discount": 40,
        "type": "percent",
        "minOrder": 199
      }
    ],
    "isVegetarian": true,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Breakfast",
      "Dosas",
      "Idlis",
      "Rice",
      "Curries",
      "Beverages"
    ],
    "menuItems": [
      {
        "id": "M027",
        "restaurantId": "R004",
        "name": "Masala Dosa",
        "description": "Crispy fermented crepe filled with spiced potato masala, with sambhar and chutneys",
        "price": 129,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_at_a_restaurant.jpg",
        "category": "Dosas",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M028",
        "restaurantId": "R004",
        "name": "Idli Vada Combo",
        "description": "Soft steamed rice cakes with crispy lentil fritters, sambhar and chutneys",
        "price": 99,
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG",
        "category": "Idlis",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M029",
        "restaurantId": "R004",
        "name": "Kerala Fish Curry",
        "description": "Tangy and spicy fish curry in coconut milk and kokum",
        "price": 299,
        "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
        "category": "Curries",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M030",
        "restaurantId": "R004",
        "name": "Curd Rice",
        "description": "Cooling yogurt rice tempered with mustard, curry leaves and pomegranate",
        "price": 99,
        "image": "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=500&q=80",
        "category": "Rice",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M031",
        "restaurantId": "R004",
        "name": "Filter Coffee",
        "description": "Traditional South Indian decoction coffee with frothy milk",
        "price": 55,
        "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
        "category": "Beverages",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Must Try"
        ]
      },
      {
        "id": "M032",
        "restaurantId": "R004",
        "name": "Uttapam",
        "description": "Thick rice pancake topped with onions, tomatoes and coriander",
        "price": 109,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_at_a_restaurant.jpg",
        "category": "Breakfast",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M033",
        "restaurantId": "R004",
        "name": "Sambar Vada",
        "description": "Crispy lentil donuts dunked in piping hot aromatic sambar",
        "price": 89,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/91/Medu_Vada.jpg",
        "category": "Idlis",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R005",
    "name": "Urban Tandoor",
    "description": "A modern twist on traditional tandoor cooking — juicy kebabs, smoky tikkas, and fluffy naans straight from the clay oven.",
    "coverImage": "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80",
    "cuisines": [
      "North Indian",
      "Tandoor",
      "Kebabs"
    ],
    "rating": 4.5,
    "reviewCount": 923,
    "priceForTwo": 700,
    "deliveryTime": 45,
    "deliveryFee": 40,
    "distance": "2.8 km",
    "address": "9 Kalyani Nagar, Kalyani Nagar, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "12:00",
      "close": "23:30",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O6",
        "label": "20% OFF",
        "description": "20% off on first order",
        "code": "URBAN20",
        "discount": 20,
        "type": "percent",
        "minOrder": 299
      },
      {
        "id": "O7",
        "label": "Free Delivery",
        "description": "Free delivery on orders above ₹499",
        "code": "FREEUT",
        "discount": 0,
        "type": "flat"
      }
    ],
    "isVegetarian": false,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Starters",
      "Kebabs",
      "Main Course",
      "Breads",
      "Rice",
      "Beverages"
    ],
    "menuItems": [
      {
        "id": "M034",
        "restaurantId": "R005",
        "name": "Seekh Kebab",
        "description": "Minced mutton mixed with spices, skewered and grilled in tandoor",
        "price": 349,
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/31/Chicken_tikka_in_Araku_Valley%2C_Andhra_Pradesh_01.jpg",
        "category": "Kebabs",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Must Try"
        ]
      },
      {
        "id": "M035",
        "restaurantId": "R005",
        "name": "Paneer Shashlik",
        "description": "Cottage cheese and vegetable skewer with bell peppers and onions",
        "price": 279,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Panir_Tikka_Indian_cheese_grilled.jpg",
        "category": "Starters",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M036",
        "restaurantId": "R005",
        "name": "Tandoori Chicken Half",
        "description": "Half chicken marinated overnight in yogurt and Kashmiri spices",
        "price": 399,
        "image": "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=500&q=80",
        "category": "Starters",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M037",
        "restaurantId": "R005",
        "name": "Dal Tadka",
        "description": "Yellow lentils tempered with ghee, cumin and garlic",
        "price": 199,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Dal_Makhani.jpg",
        "category": "Main Course",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M038",
        "restaurantId": "R005",
        "name": "Butter Naan",
        "description": "Fluffy tandoor bread brushed with butter",
        "price": 49,
        "image": "https://upload.wikimedia.org/wikipedia/commons/8/81/Garlic_naan_1.jpg",
        "category": "Breads",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M039",
        "restaurantId": "R005",
        "name": "Mutton Biryani",
        "description": "Dum-cooked mutton biryani with saffron rice",
        "price": 449,
        "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80",
        "category": "Rice",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M040",
        "restaurantId": "R005",
        "name": "Raita",
        "description": "Chilled yogurt with cucumber, tomato and spices",
        "price": 69,
        "image": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&q=80",
        "category": "Beverages",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R006",
    "name": "Burger District",
    "description": "Crafted burgers using premium ingredients — thick patties, fresh buns, and signature sauces that define the perfect bite.",
    "coverImage": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80",
    "cuisines": [
      "Burgers",
      "Fast Food",
      "American"
    ],
    "rating": 4.2,
    "reviewCount": 789,
    "priceForTwo": 400,
    "deliveryTime": 20,
    "deliveryFee": 15,
    "distance": "0.5 km",
    "address": "3 Viman Nagar, Viman Nagar, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "10:00",
      "close": "01:00",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O8",
        "label": "Buy 1 Get 1",
        "description": "Buy 1 burger get 1 free on Tuesdays",
        "code": "BOGO",
        "discount": 50,
        "type": "percent",
        "minOrder": 199
      }
    ],
    "isVegetarian": false,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Burgers",
      "Sides",
      "Wraps",
      "Beverages",
      "Desserts"
    ],
    "menuItems": [
      {
        "id": "M041",
        "restaurantId": "R006",
        "name": "Classic Smash Burger",
        "description": "Double smash patty with American cheese, pickles, onions and special sauce",
        "price": 249,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
        "category": "Burgers",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M042",
        "restaurantId": "R006",
        "name": "Crispy Chicken Burger",
        "description": "Buttermilk fried chicken with coleslaw and honey mustard",
        "price": 229,
        "image": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&q=80",
        "category": "Burgers",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M043",
        "restaurantId": "R006",
        "name": "Veg Chickpea Burger",
        "description": "Spiced chickpea and vegetable patty with avocado spread",
        "price": 199,
        "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&q=80",
        "category": "Burgers",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M044",
        "restaurantId": "R006",
        "name": "Loaded Fries",
        "description": "Crispy fries topped with cheese sauce, jalapeños and sour cream",
        "price": 149,
        "image": "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=500&q=80",
        "category": "Sides",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M045",
        "restaurantId": "R006",
        "name": "Chicken Wrap",
        "description": "Grilled chicken strips in a whole wheat wrap with fresh veggies",
        "price": 199,
        "image": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80",
        "category": "Wraps",
        "isVegetarian": false,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M046",
        "restaurantId": "R006",
        "name": "Chocolate Shake",
        "description": "Thick and creamy handcrafted chocolate milkshake",
        "price": 129,
        "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80",
        "category": "Beverages",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M047",
        "restaurantId": "R006",
        "name": "Brownie Sundae",
        "description": "Warm fudge brownie with vanilla ice cream and chocolate sauce",
        "price": 149,
        "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",
        "category": "Desserts",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R007",
    "name": "Dosa House",
    "description": "Specialists in crispy, golden dosas since 1992. Over 25 varieties of dosa prepared fresh to order, with authentic chutneys and sambhar.",
    "coverImage": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&q=80",
    "cuisines": [
      "South Indian",
      "Dosas",
      "Vegetarian"
    ],
    "rating": 4.8,
    "reviewCount": 2156,
    "priceForTwo": 250,
    "deliveryTime": 25,
    "deliveryFee": 20,
    "distance": "1.0 km",
    "address": "18 Deccan Gymkhana, Deccan, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "07:30",
      "close": "21:30",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O9",
        "label": "60% OFF",
        "description": "60% off up to ₹120 on first order",
        "code": "DOSA60",
        "discount": 60,
        "type": "percent",
        "minOrder": 149
      }
    ],
    "isVegetarian": true,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Plain Dosas",
      "Masala Dosas",
      "Special Dosas",
      "Idli & Vada",
      "Rice Dishes",
      "Beverages"
    ],
    "menuItems": [
      {
        "id": "M048",
        "restaurantId": "R007",
        "name": "Plain Dosa",
        "description": "Classic thin and crispy fermented rice-lentil crepe with sambhar and coconut chutney",
        "price": 79,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_at_a_restaurant.jpg",
        "category": "Plain Dosas",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M049",
        "restaurantId": "R007",
        "name": "Masala Dosa",
        "description": "Crispy dosa filled with spiced potato masala",
        "price": 99,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_at_a_restaurant.jpg",
        "category": "Masala Dosas",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Classic"
        ]
      },
      {
        "id": "M050",
        "restaurantId": "R007",
        "name": "Mysore Masala Dosa",
        "description": "Dosa with red chutney spread, potato filling and onion",
        "price": 109,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_at_a_restaurant.jpg",
        "category": "Masala Dosas",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Spicy"
        ]
      },
      {
        "id": "M051",
        "restaurantId": "R007",
        "name": "Cheese Dosa",
        "description": "Dosa with melted cheese spread and mild spices",
        "price": 139,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Dosa_at_a_restaurant.jpg",
        "category": "Special Dosas",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M052",
        "restaurantId": "R007",
        "name": "Idli (2 pcs)",
        "description": "Soft steamed rice cakes served with sambhar and chutneys",
        "price": 69,
        "image": "https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG",
        "category": "Idli & Vada",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M053",
        "restaurantId": "R007",
        "name": "Medu Vada",
        "description": "Crispy lentil donuts with sambhar and coconut chutney",
        "price": 79,
        "image": "https://upload.wikimedia.org/wikipedia/commons/9/91/Medu_Vada.jpg",
        "category": "Idli & Vada",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M054",
        "restaurantId": "R007",
        "name": "Lemon Rice",
        "description": "Fragrant rice with lemon, mustard seeds, curry leaves and cashews",
        "price": 89,
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
        "category": "Rice Dishes",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M055",
        "restaurantId": "R007",
        "name": "Badam Milk",
        "description": "Chilled almond-flavored milk with saffron",
        "price": 69,
        "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80",
        "category": "Beverages",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R008",
    "name": "Pasta Street",
    "description": "Italian-inspired pastas and pizzas made from scratch — with authentic sauces, artisanal cheeses, and fresh herbs.",
    "coverImage": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80",
    "cuisines": [
      "Italian",
      "Pasta",
      "Pizza"
    ],
    "rating": 4.4,
    "reviewCount": 567,
    "priceForTwo": 550,
    "deliveryTime": 35,
    "deliveryFee": 30,
    "distance": "1.8 km",
    "address": "31 Koregaon Park Lane, Koregaon Park, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "11:30",
      "close": "23:00",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O10",
        "label": "₹100 OFF",
        "description": "Flat ₹100 off on orders above ₹499",
        "code": "PASTA100",
        "discount": 100,
        "type": "flat",
        "minOrder": 499
      }
    ],
    "isVegetarian": false,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Antipasti",
      "Pastas",
      "Pizzas",
      "Risotto",
      "Desserts",
      "Beverages"
    ],
    "menuItems": [
      {
        "id": "M056",
        "restaurantId": "R008",
        "name": "Bruschetta",
        "description": "Toasted ciabatta with tomatoes, fresh basil, garlic and olive oil",
        "price": 179,
        "image": "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&q=80",
        "category": "Antipasti",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M057",
        "restaurantId": "R008",
        "name": "Spaghetti Carbonara",
        "description": "Spaghetti with egg yolk, Parmesan, guanciale and black pepper",
        "price": 349,
        "image": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&q=80",
        "category": "Pastas",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M058",
        "restaurantId": "R008",
        "name": "Penne Arrabbiata",
        "description": "Penne in spicy tomato sauce with garlic and fresh basil",
        "price": 279,
        "image": "https://images.unsplash.com/photo-1621996346565-e3def6164286?w=500&q=80",
        "category": "Pastas",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M059",
        "restaurantId": "R008",
        "name": "Margherita Pizza",
        "description": "Classic pizza with San Marzano tomatoes, mozzarella and fresh basil",
        "price": 349,
        "image": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80",
        "category": "Pizzas",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M060",
        "restaurantId": "R008",
        "name": "Quattro Formaggi Pizza",
        "description": "Four-cheese pizza with mozzarella, gorgonzola, fontina and Parmesan",
        "price": 419,
        "image": "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500&q=80",
        "category": "Pizzas",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M061",
        "restaurantId": "R008",
        "name": "Mushroom Risotto",
        "description": "Creamy Arborio rice with porcini mushrooms and Parmesan",
        "price": 379,
        "image": "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500&q=80",
        "category": "Risotto",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M062",
        "restaurantId": "R008",
        "name": "Tiramisu",
        "description": "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
        "price": 229,
        "image": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80",
        "category": "Desserts",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R009",
    "name": "Biryani Junction",
    "description": "Where every grain tells a story — slow-cooked dum biryanis using age-old recipes, available in Hyderabadi, Lucknowi, and Kolkata styles.",
    "coverImage": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?w=200&q=80",
    "cuisines": [
      "Biryani",
      "Hyderabadi",
      "Mughlai"
    ],
    "rating": 4.5,
    "reviewCount": 1876,
    "priceForTwo": 500,
    "deliveryTime": 50,
    "deliveryFee": 35,
    "distance": "3.2 km",
    "address": "76 Hadapsar Main Road, Hadapsar, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "11:00",
      "close": "23:30",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O11",
        "label": "25% OFF",
        "description": "25% off on orders above ₹299",
        "code": "BIRJCT25",
        "discount": 25,
        "type": "percent",
        "minOrder": 299
      }
    ],
    "isVegetarian": false,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Chicken Biryani",
      "Mutton Biryani",
      "Veg Biryani",
      "Kebabs",
      "Raita & Sides",
      "Beverages"
    ],
    "menuItems": [
      {
        "id": "M063",
        "restaurantId": "R009",
        "name": "Hyderabadi Chicken Biryani",
        "description": "Dum-cooked Hyderabadi style biryani with tender chicken and saffron rice",
        "price": 349,
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/23/A_home_made_plate_of_mutton_biryani_served_with_chicken_kassa_cooked_in_the_bengali_style.jpg",
        "category": "Chicken Biryani",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M064",
        "restaurantId": "R009",
        "name": "Mutton Biryani",
        "description": "Slow-cooked mutton pieces in aromatic rice, Lucknowi style",
        "price": 449,
        "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80",
        "category": "Mutton Biryani",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M065",
        "restaurantId": "R009",
        "name": "Veg Dum Biryani",
        "description": "Mixed vegetable biryani with fragrant whole spices",
        "price": 249,
        "image": "https://images.unsplash.com/photo-1546456073-ea246a7bd25f?w=500&q=80",
        "category": "Veg Biryani",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M066",
        "restaurantId": "R009",
        "name": "Chicken Seekh Kebab",
        "description": "Minced chicken kebabs served with mint chutney and onion rings",
        "price": 279,
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/31/Chicken_tikka_in_Araku_Valley%2C_Andhra_Pradesh_01.jpg",
        "category": "Kebabs",
        "isVegetarian": false,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M067",
        "restaurantId": "R009",
        "name": "Mirchi ka Salan",
        "description": "Spicy green chilli curry — classic Hyderabadi biryani accompaniment",
        "price": 99,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Dal_Makhani.jpg",
        "category": "Raita & Sides",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M068",
        "restaurantId": "R009",
        "name": "Boondi Raita",
        "description": "Chilled yogurt with fried gram flour balls and spices",
        "price": 79,
        "image": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=500&q=80",
        "category": "Raita & Sides",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M069",
        "restaurantId": "R009",
        "name": "Soft Drink",
        "description": "Chilled cola, lime or orange",
        "price": 60,
        "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
        "category": "Beverages",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  },
  {
    "id": "R010",
    "name": "Sweet Theory",
    "description": "A celebration of desserts — from classic Indian mithai to modern patisserie. Every sweet tells a story of craft and care.",
    "coverImage": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80",
    "logo": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80",
    "cuisines": [
      "Desserts",
      "Cakes",
      "Mithai"
    ],
    "rating": 4.6,
    "reviewCount": 943,
    "priceForTwo": 350,
    "deliveryTime": 30,
    "deliveryFee": 25,
    "distance": "1.4 km",
    "address": "2 Camp Road, Camp, Pune",
    "city": "Pune",
    "openingHours": {
      "open": "10:00",
      "close": "22:00",
      "days": "Mon-Sun"
    },
    "offers": [
      {
        "id": "O12",
        "label": "15% OFF",
        "description": "15% off on all cakes",
        "code": "SWEET15",
        "discount": 15,
        "type": "percent",
        "minOrder": 199
      }
    ],
    "isVegetarian": true,
    "isOpen": true,
    "categories": [
      "Recommended",
      "Cakes",
      "Pastries",
      "Indian Sweets",
      "Ice Creams",
      "Drinks"
    ],
    "menuItems": [
      {
        "id": "M070",
        "restaurantId": "R010",
        "name": "Red Velvet Cake (Slice)",
        "description": "Moist red velvet with cream cheese frosting — a timeless classic",
        "price": 149,
        "image": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500&q=80",
        "category": "Cakes",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Bestseller"
        ]
      },
      {
        "id": "M071",
        "restaurantId": "R010",
        "name": "Chocolate Truffle Cake (Slice)",
        "description": "Decadent layers of chocolate sponge with ganache and truffles",
        "price": 159,
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
        "category": "Cakes",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M072",
        "restaurantId": "R010",
        "name": "Kaju Katli (250g)",
        "description": "Traditional cashew fudge diamond — perfectly smooth and delicate",
        "price": 249,
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/58/Two_Gulab_Jamun_in_a_plate_01.jpg",
        "category": "Indian Sweets",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true,
        "tags": [
          "Festive"
        ]
      },
      {
        "id": "M073",
        "restaurantId": "R010",
        "name": "Gulab Jamun (4 pcs)",
        "description": "Soft milk-solid balls soaked in rose-cardamom syrup",
        "price": 99,
        "image": "https://upload.wikimedia.org/wikipedia/commons/5/58/Two_Gulab_Jamun_in_a_plate_01.jpg",
        "category": "Indian Sweets",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M074",
        "restaurantId": "R010",
        "name": "Belgian Chocolate Éclair",
        "description": "Choux pastry filled with chocolate cream, topped with chocolate glaze",
        "price": 89,
        "image": "https://images.unsplash.com/photo-1612203985729-70726954388c?w=500&q=80",
        "category": "Pastries",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M075",
        "restaurantId": "R010",
        "name": "Kulfi Falooda",
        "description": "Traditional Indian ice cream with vermicelli, basil seeds and rose syrup",
        "price": 129,
        "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80",
        "category": "Ice Creams",
        "isVegetarian": true,
        "isPopular": true,
        "isAvailable": true
      },
      {
        "id": "M076",
        "restaurantId": "R010",
        "name": "Rose Milk",
        "description": "Chilled milk infused with rose essence and cardamom",
        "price": 79,
        "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80",
        "category": "Drinks",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      },
      {
        "id": "M077",
        "restaurantId": "R010",
        "name": "Cheesecake (Slice)",
        "description": "New York style baked cheesecake with blueberry compote",
        "price": 169,
        "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80",
        "category": "Cakes",
        "isVegetarian": true,
        "isPopular": false,
        "isAvailable": true
      }
    ]
  }
];

export const sampleOrders = [
  {
    "id": "ORD001",
    "userId": "USR001",
    "restaurantId": "R001",
    "restaurantName": "Spice Route",
    "items": [
      {
        "menuItemId": "M004",
        "name": "Butter Chicken",
        "price": 319,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80"
      },
      {
        "menuItemId": "M006",
        "name": "Garlic Naan",
        "price": 59,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80"
      }
    ],
    "subtotal": 815,
    "deliveryFee": 30,
    "tax": 41,
    "discount": 100,
    "total": 786,
    "address": {
      "id": "A001",
      "label": "Home",
      "street": "12 Senapati Bapat Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411016"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-08-10T12:30:00Z",
    "updatedAt": "2026-08-10T13:45:00Z",
    "estimatedDelivery": "2026-08-10T13:05:00Z"
  },
  {
    "id": "ORD002",
    "userId": "USR001",
    "restaurantId": "R004",
    "restaurantName": "Curry Leaf",
    "items": [
      {
        "menuItemId": "M027",
        "name": "Masala Dosa",
        "price": 129,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80"
      },
      {
        "menuItemId": "M031",
        "name": "Filter Coffee",
        "price": 55,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
      }
    ],
    "subtotal": 368,
    "deliveryFee": 25,
    "tax": 18,
    "discount": 80,
    "total": 331,
    "address": {
      "id": "A001",
      "label": "Home",
      "street": "12 Senapati Bapat Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411016"
    },
    "paymentMethod": "Card",
    "status": "DELIVERED",
    "createdAt": "2026-08-20T08:00:00Z",
    "updatedAt": "2026-08-20T08:50:00Z",
    "estimatedDelivery": "2026-08-20T08:30:00Z"
  },
  {
    "id": "ORD003",
    "userId": "USR001",
    "restaurantId": "R009",
    "restaurantName": "Biryani Junction",
    "items": [
      {
        "menuItemId": "M063",
        "name": "Hyderabadi Chicken Biryani",
        "price": 349,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80"
      },
      {
        "menuItemId": "M068",
        "name": "Boondi Raita",
        "price": 79,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
      }
    ],
    "subtotal": 428,
    "deliveryFee": 35,
    "tax": 21,
    "discount": 0,
    "total": 484,
    "address": {
      "id": "A002",
      "label": "Work",
      "street": "5th Floor, Cyber City Tower",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411057"
    },
    "paymentMethod": "COD",
    "status": "DELIVERED",
    "createdAt": "2026-09-01T13:00:00Z",
    "updatedAt": "2026-09-01T14:10:00Z",
    "estimatedDelivery": "2026-09-01T13:50:00Z"
  },
  {
    "id": "ORD004",
    "userId": "USR002",
    "restaurantId": "R002",
    "restaurantName": "The Bombay Tiffin",
    "items": [
      {
        "menuItemId": "M012",
        "name": "Pav Bhaji",
        "price": 149,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"
      },
      {
        "menuItemId": "M017",
        "name": "Cutting Chai",
        "price": 25,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
      }
    ],
    "subtotal": 348,
    "deliveryFee": 20,
    "tax": 17,
    "discount": 100,
    "total": 285,
    "address": {
      "id": "A003",
      "label": "Home",
      "street": "7 Koregaon Park Lane",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-08-25T10:00:00Z",
    "updatedAt": "2026-08-25T10:40:00Z",
    "estimatedDelivery": "2026-08-25T10:25:00Z"
  },
  {
    "id": "ORD005",
    "userId": "USR002",
    "restaurantId": "R010",
    "restaurantName": "Sweet Theory",
    "items": [
      {
        "menuItemId": "M070",
        "name": "Red Velvet Cake (Slice)",
        "price": 149,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
      },
      {
        "menuItemId": "M075",
        "name": "Kulfi Falooda",
        "price": 129,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"
      }
    ],
    "subtotal": 427,
    "deliveryFee": 25,
    "tax": 21,
    "discount": 0,
    "total": 473,
    "address": {
      "id": "A003",
      "label": "Home",
      "street": "7 Koregaon Park Lane",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "paymentMethod": "Wallet",
    "status": "DELIVERED",
    "createdAt": "2026-09-05T16:00:00Z",
    "updatedAt": "2026-09-05T16:45:00Z",
    "estimatedDelivery": "2026-09-05T16:30:00Z"
  },
  {
    "id": "ORD006",
    "userId": "USR003",
    "restaurantId": "R003",
    "restaurantName": "Wok & Bowl",
    "items": [
      {
        "menuItemId": "M022",
        "name": "Kung Pao Chicken",
        "price": 299,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80"
      },
      {
        "menuItemId": "M023",
        "name": "Veg Hakka Noodles",
        "price": 199,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80"
      }
    ],
    "subtotal": 498,
    "deliveryFee": 35,
    "tax": 25,
    "discount": 75,
    "total": 483,
    "address": {
      "id": "A004",
      "label": "Home",
      "street": "22 Baner Hills",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411045"
    },
    "paymentMethod": "Card",
    "status": "CANCELLED",
    "createdAt": "2026-08-18T19:00:00Z",
    "updatedAt": "2026-08-18T19:20:00Z",
    "estimatedDelivery": "2026-08-18T19:40:00Z"
  },
  {
    "id": "ORD007",
    "userId": "USR003",
    "restaurantId": "R006",
    "restaurantName": "Burger District",
    "items": [
      {
        "menuItemId": "M041",
        "name": "Classic Smash Burger",
        "price": 249,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"
      },
      {
        "menuItemId": "M044",
        "name": "Loaded Fries",
        "price": 149,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80"
      }
    ],
    "subtotal": 647,
    "deliveryFee": 15,
    "tax": 32,
    "discount": 0,
    "total": 694,
    "address": {
      "id": "A004",
      "label": "Home",
      "street": "22 Baner Hills",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411045"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-09-02T20:30:00Z",
    "updatedAt": "2026-09-02T21:10:00Z",
    "estimatedDelivery": "2026-09-02T20:50:00Z"
  },
  {
    "id": "ORD008",
    "userId": "USR004",
    "restaurantId": "R004",
    "restaurantName": "Curry Leaf",
    "items": [
      {
        "menuItemId": "M027",
        "name": "Masala Dosa",
        "price": 129,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80"
      },
      {
        "menuItemId": "M029",
        "name": "Kerala Fish Curry",
        "price": 299,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"
      },
      {
        "menuItemId": "M031",
        "name": "Filter Coffee",
        "price": 55,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
      }
    ],
    "subtotal": 851,
    "deliveryFee": 25,
    "tax": 43,
    "discount": 80,
    "total": 839,
    "address": {
      "id": "A006",
      "label": "Home",
      "street": "15 Aundh Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411007"
    },
    "paymentMethod": "Card",
    "status": "DELIVERED",
    "createdAt": "2026-07-15T09:00:00Z",
    "updatedAt": "2026-07-15T09:50:00Z",
    "estimatedDelivery": "2026-07-15T09:30:00Z"
  },
  {
    "id": "ORD009",
    "userId": "USR004",
    "restaurantId": "R007",
    "restaurantName": "Dosa House",
    "items": [
      {
        "menuItemId": "M052",
        "name": "Idli (2 pcs)",
        "price": 69,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80"
      },
      {
        "menuItemId": "M050",
        "name": "Mysore Masala Dosa",
        "price": 109,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80"
      }
    ],
    "subtotal": 247,
    "deliveryFee": 20,
    "tax": 12,
    "discount": 120,
    "total": 159,
    "address": {
      "id": "A007",
      "label": "Work",
      "street": "Tech Park, Hinjewadi Phase 1",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411057"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-08-01T08:30:00Z",
    "updatedAt": "2026-08-01T09:00:00Z",
    "estimatedDelivery": "2026-08-01T08:55:00Z"
  },
  {
    "id": "ORD010",
    "userId": "USR004",
    "restaurantId": "R009",
    "restaurantName": "Biryani Junction",
    "items": [
      {
        "menuItemId": "M063",
        "name": "Hyderabadi Chicken Biryani",
        "price": 349,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80"
      },
      {
        "menuItemId": "M067",
        "name": "Mirchi ka Salan",
        "price": 99,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80"
      }
    ],
    "subtotal": 797,
    "deliveryFee": 35,
    "tax": 40,
    "discount": 200,
    "total": 672,
    "address": {
      "id": "A006",
      "label": "Home",
      "street": "15 Aundh Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411007"
    },
    "paymentMethod": "Wallet",
    "status": "DELIVERED",
    "createdAt": "2026-09-07T13:30:00Z",
    "updatedAt": "2026-09-07T14:30:00Z",
    "estimatedDelivery": "2026-09-07T14:20:00Z"
  },
  {
    "id": "ORD011",
    "userId": "USR005",
    "restaurantId": "R009",
    "restaurantName": "Biryani Junction",
    "items": [
      {
        "menuItemId": "M063",
        "name": "Hyderabadi Chicken Biryani",
        "price": 349,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80"
      }
    ],
    "subtotal": 349,
    "deliveryFee": 35,
    "tax": 17,
    "discount": 87,
    "total": 314,
    "address": {
      "id": "A008",
      "label": "Home",
      "street": "9 Hadapsar Ring Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411028"
    },
    "paymentMethod": "COD",
    "status": "DELIVERED",
    "createdAt": "2026-09-08T19:00:00Z",
    "updatedAt": "2026-09-08T20:00:00Z",
    "estimatedDelivery": "2026-09-08T19:50:00Z"
  },
  {
    "id": "ORD012",
    "userId": "USR006",
    "restaurantId": "R004",
    "restaurantName": "Curry Leaf",
    "items": [
      {
        "menuItemId": "M028",
        "name": "Idli Vada Combo",
        "price": 99,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80"
      },
      {
        "menuItemId": "M031",
        "name": "Filter Coffee",
        "price": 55,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
      }
    ],
    "subtotal": 308,
    "deliveryFee": 25,
    "tax": 15,
    "discount": 80,
    "total": 268,
    "address": {
      "id": "A009",
      "label": "Home",
      "street": "45 Viman Nagar Main",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411014"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-08-05T08:00:00Z",
    "updatedAt": "2026-08-05T08:50:00Z",
    "estimatedDelivery": "2026-08-05T08:30:00Z"
  },
  {
    "id": "ORD013",
    "userId": "USR006",
    "restaurantId": "R007",
    "restaurantName": "Dosa House",
    "items": [
      {
        "menuItemId": "M049",
        "name": "Masala Dosa",
        "price": 99,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80"
      }
    ],
    "subtotal": 297,
    "deliveryFee": 20,
    "tax": 15,
    "discount": 60,
    "total": 272,
    "address": {
      "id": "A010",
      "label": "Work",
      "street": "IT Park, Kharadi",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411014"
    },
    "paymentMethod": "Card",
    "status": "DELIVERED",
    "createdAt": "2026-08-22T12:00:00Z",
    "updatedAt": "2026-08-22T12:45:00Z",
    "estimatedDelivery": "2026-08-22T12:25:00Z"
  },
  {
    "id": "ORD014",
    "userId": "USR006",
    "restaurantId": "R002",
    "restaurantName": "The Bombay Tiffin",
    "items": [
      {
        "menuItemId": "M012",
        "name": "Pav Bhaji",
        "price": 149,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"
      },
      {
        "menuItemId": "M011",
        "name": "Vada Pav",
        "price": 45,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=80"
      }
    ],
    "subtotal": 478,
    "deliveryFee": 20,
    "tax": 24,
    "discount": 100,
    "total": 422,
    "address": {
      "id": "A009",
      "label": "Home",
      "street": "45 Viman Nagar Main",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411014"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-09-03T18:30:00Z",
    "updatedAt": "2026-09-03T19:15:00Z",
    "estimatedDelivery": "2026-09-03T19:00:00Z"
  },
  {
    "id": "ORD015",
    "userId": "USR007",
    "restaurantId": "R001",
    "restaurantName": "Spice Route",
    "items": [
      {
        "menuItemId": "M001",
        "name": "Chicken Tikka",
        "price": 299,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80"
      },
      {
        "menuItemId": "M003",
        "name": "Dal Makhani",
        "price": 229,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&q=80"
      },
      {
        "menuItemId": "M006",
        "name": "Garlic Naan",
        "price": 59,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80"
      }
    ],
    "subtotal": 764,
    "deliveryFee": 30,
    "tax": 38,
    "discount": 100,
    "total": 732,
    "address": {
      "id": "A011",
      "label": "Home",
      "street": "3 Camp Area, Near MG Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "paymentMethod": "Card",
    "status": "DELIVERED",
    "createdAt": "2026-07-20T20:00:00Z",
    "updatedAt": "2026-07-20T21:00:00Z",
    "estimatedDelivery": "2026-07-20T20:35:00Z"
  },
  {
    "id": "ORD016",
    "userId": "USR007",
    "restaurantId": "R005",
    "restaurantName": "Urban Tandoor",
    "items": [
      {
        "menuItemId": "M034",
        "name": "Seekh Kebab",
        "price": 349,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80"
      },
      {
        "menuItemId": "M038",
        "name": "Butter Naan",
        "price": 49,
        "quantity": 4,
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80"
      }
    ],
    "subtotal": 894,
    "deliveryFee": 40,
    "tax": 45,
    "discount": 180,
    "total": 799,
    "address": {
      "id": "A011",
      "label": "Home",
      "street": "3 Camp Area, Near MG Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-08-28T21:00:00Z",
    "updatedAt": "2026-08-28T22:00:00Z",
    "estimatedDelivery": "2026-08-28T21:45:00Z"
  },
  {
    "id": "ORD017",
    "userId": "USR007",
    "restaurantId": "R009",
    "restaurantName": "Biryani Junction",
    "items": [
      {
        "menuItemId": "M064",
        "name": "Mutton Biryani",
        "price": 449,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80"
      },
      {
        "menuItemId": "M068",
        "name": "Boondi Raita",
        "price": 79,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
      }
    ],
    "subtotal": 528,
    "deliveryFee": 35,
    "tax": 26,
    "discount": 0,
    "total": 589,
    "address": {
      "id": "A011",
      "label": "Home",
      "street": "3 Camp Area, Near MG Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411001"
    },
    "paymentMethod": "COD",
    "status": "DELIVERED",
    "createdAt": "2026-09-06T13:00:00Z",
    "updatedAt": "2026-09-06T14:10:00Z",
    "estimatedDelivery": "2026-09-06T13:50:00Z"
  },
  {
    "id": "ORD018",
    "userId": "USR008",
    "restaurantId": "R008",
    "restaurantName": "Pasta Street",
    "items": [
      {
        "menuItemId": "M057",
        "name": "Spaghetti Carbonara",
        "price": 349,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80"
      },
      {
        "menuItemId": "M059",
        "name": "Margherita Pizza",
        "price": 349,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80"
      }
    ],
    "subtotal": 1047,
    "deliveryFee": 30,
    "tax": 52,
    "discount": 100,
    "total": 1029,
    "address": {
      "id": "A012",
      "label": "Home",
      "street": "18 Kothrud, Near Chandni Chowk",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411038"
    },
    "paymentMethod": "Card",
    "status": "CANCELLED",
    "createdAt": "2026-09-04T19:00:00Z",
    "updatedAt": "2026-09-04T19:30:00Z",
    "estimatedDelivery": "2026-09-04T19:35:00Z"
  },
  {
    "id": "ORD019",
    "userId": "USR008",
    "restaurantId": "R010",
    "restaurantName": "Sweet Theory",
    "items": [
      {
        "menuItemId": "M070",
        "name": "Red Velvet Cake (Slice)",
        "price": 149,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
      },
      {
        "menuItemId": "M071",
        "name": "Chocolate Truffle Cake (Slice)",
        "price": 159,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
      }
    ],
    "subtotal": 308,
    "deliveryFee": 25,
    "tax": 15,
    "discount": 0,
    "total": 348,
    "address": {
      "id": "A013",
      "label": "Other",
      "street": "Block C, Magarpatta City",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411013"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-09-08T15:00:00Z",
    "updatedAt": "2026-09-08T15:45:00Z",
    "estimatedDelivery": "2026-09-08T15:30:00Z"
  },
  {
    "id": "ORD020",
    "userId": "USR009",
    "restaurantId": "R001",
    "restaurantName": "Spice Route",
    "items": [
      {
        "menuItemId": "M005",
        "name": "Chicken Biryani",
        "price": 349,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80"
      },
      {
        "menuItemId": "M007",
        "name": "Gulab Jamun",
        "price": 99,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
      }
    ],
    "subtotal": 797,
    "deliveryFee": 30,
    "tax": 40,
    "discount": 100,
    "total": 767,
    "address": {
      "id": "A014",
      "label": "Home",
      "street": "6 Shivajinagar, Near FC Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411005"
    },
    "paymentMethod": "Card",
    "status": "DELIVERED",
    "createdAt": "2026-07-10T13:00:00Z",
    "updatedAt": "2026-07-10T14:10:00Z",
    "estimatedDelivery": "2026-07-10T13:50:00Z"
  },
  {
    "id": "ORD021",
    "userId": "USR009",
    "restaurantId": "R003",
    "restaurantName": "Wok & Bowl",
    "items": [
      {
        "menuItemId": "M022",
        "name": "Kung Pao Chicken",
        "price": 299,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80"
      },
      {
        "menuItemId": "M025",
        "name": "Honey Chilli Potato",
        "price": 179,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"
      }
    ],
    "subtotal": 777,
    "deliveryFee": 35,
    "tax": 39,
    "discount": 75,
    "total": 776,
    "address": {
      "id": "A014",
      "label": "Home",
      "street": "6 Shivajinagar, Near FC Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411005"
    },
    "paymentMethod": "UPI",
    "status": "DELIVERED",
    "createdAt": "2026-08-05T19:30:00Z",
    "updatedAt": "2026-08-05T20:30:00Z",
    "estimatedDelivery": "2026-08-05T20:10:00Z"
  },
  {
    "id": "ORD022",
    "userId": "USR009",
    "restaurantId": "R006",
    "restaurantName": "Burger District",
    "items": [
      {
        "menuItemId": "M041",
        "name": "Classic Smash Burger",
        "price": 249,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80"
      },
      {
        "menuItemId": "M046",
        "name": "Chocolate Shake",
        "price": 129,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80"
      }
    ],
    "subtotal": 1134,
    "deliveryFee": 15,
    "tax": 57,
    "discount": 0,
    "total": 1206,
    "address": {
      "id": "A014",
      "label": "Home",
      "street": "6 Shivajinagar, Near FC Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411005"
    },
    "paymentMethod": "Card",
    "status": "DELIVERED",
    "createdAt": "2026-09-07T21:00:00Z",
    "updatedAt": "2026-09-07T21:45:00Z",
    "estimatedDelivery": "2026-09-07T21:20:00Z"
  },
  {
    "id": "ORD023",
    "userId": "USR001",
    "restaurantId": "R005",
    "restaurantName": "Urban Tandoor",
    "items": [
      {
        "menuItemId": "M036",
        "name": "Tandoori Chicken Half",
        "price": 399,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&q=80"
      },
      {
        "menuItemId": "M038",
        "name": "Butter Naan",
        "price": 49,
        "quantity": 3,
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80"
      }
    ],
    "subtotal": 546,
    "deliveryFee": 40,
    "tax": 27,
    "discount": 0,
    "total": 613,
    "address": {
      "id": "A001",
      "label": "Home",
      "street": "12 Senapati Bapat Road",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411016"
    },
    "paymentMethod": "UPI",
    "status": "OUT_FOR_DELIVERY",
    "createdAt": "2026-09-09T19:00:00Z",
    "updatedAt": "2026-09-09T19:45:00Z",
    "estimatedDelivery": "2026-09-09T20:15:00Z"
  },
  {
    "id": "ORD024",
    "userId": "USR004",
    "restaurantId": "R007",
    "restaurantName": "Dosa House",
    "items": [
      {
        "menuItemId": "M051",
        "name": "Cheese Dosa",
        "price": 139,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80"
      }
    ],
    "subtotal": 278,
    "deliveryFee": 20,
    "tax": 14,
    "discount": 0,
    "total": 312,
    "address": {
      "id": "A007",
      "label": "Work",
      "street": "Tech Park, Hinjewadi Phase 1",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411057"
    },
    "paymentMethod": "Card",
    "status": "PREPARING",
    "createdAt": "2026-09-09T20:00:00Z",
    "updatedAt": "2026-09-09T20:10:00Z",
    "estimatedDelivery": "2026-09-09T20:40:00Z"
  },
  {
    "id": "ORD025",
    "userId": "USR006",
    "restaurantId": "R010",
    "restaurantName": "Sweet Theory",
    "items": [
      {
        "menuItemId": "M072",
        "name": "Kaju Katli (250g)",
        "price": 249,
        "quantity": 1,
        "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
      },
      {
        "menuItemId": "M070",
        "name": "Red Velvet Cake (Slice)",
        "price": 149,
        "quantity": 2,
        "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80"
      }
    ],
    "subtotal": 547,
    "deliveryFee": 25,
    "tax": 27,
    "discount": 0,
    "total": 599,
    "address": {
      "id": "A009",
      "label": "Home",
      "street": "45 Viman Nagar Main",
      "city": "Pune",
      "state": "Maharashtra",
      "pincode": "411014"
    },
    "paymentMethod": "UPI",
    "status": "CONFIRMED",
    "createdAt": "2026-09-09T20:30:00Z",
    "updatedAt": "2026-09-09T20:35:00Z",
    "estimatedDelivery": "2026-09-09T21:10:00Z"
  }
];

export const sampleRefunds = [
  {
    "id": "RF001",
    "orderId": "ORD006",
    "userId": "USR003",
    "restaurantId": "R003",
    "amount": 483,
    "reason": "RESTAURANT_CANCELLED",
    "description": "Restaurant cancelled my order after 30 minutes. Order never arrived.",
    "status": "PENDING",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-08-18T19:30:00Z",
        "note": "Refund request submitted"
      }
    ],
    "createdAt": "2026-08-18T19:30:00Z",
    "updatedAt": "2026-08-18T19:30:00Z"
  },
  {
    "id": "RF002",
    "orderId": "ORD004",
    "userId": "USR002",
    "restaurantId": "R002",
    "amount": 285,
    "reason": "WRONG_ITEM",
    "description": "Received vada pav instead of the pav bhaji I ordered. Wrong items delivered.",
    "status": "UNDER_REVIEW",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-08-25T11:00:00Z",
        "note": "Refund request submitted"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-08-25T13:00:00Z",
        "note": "Team is reviewing your request"
      }
    ],
    "createdAt": "2026-08-25T11:00:00Z",
    "updatedAt": "2026-08-25T13:00:00Z"
  },
  {
    "id": "RF003",
    "orderId": "ORD001",
    "userId": "USR001",
    "restaurantId": "R001",
    "amount": 786,
    "reason": "FOOD_QUALITY",
    "description": "The butter chicken was stale and had an off smell. Food quality was very poor.",
    "status": "APPROVED",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-08-10T14:00:00Z"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-08-10T15:00:00Z"
      },
      {
        "status": "APPROVED",
        "date": "2026-08-11T10:00:00Z",
        "note": "Refund approved after review"
      }
    ],
    "createdAt": "2026-08-10T14:00:00Z",
    "updatedAt": "2026-08-11T10:00:00Z"
  },
  {
    "id": "RF004",
    "orderId": "ORD007",
    "userId": "USR003",
    "restaurantId": "R006",
    "amount": 694,
    "reason": "MISSING_ITEM",
    "description": "The loaded fries were missing from my delivery. Only received the burgers.",
    "status": "REJECTED",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-09-02T21:30:00Z"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-09-03T09:00:00Z"
      },
      {
        "status": "REJECTED",
        "date": "2026-09-03T15:00:00Z",
        "note": "Delivery partner confirmed all items were delivered. Request rejected."
      }
    ],
    "createdAt": "2026-09-02T21:30:00Z",
    "updatedAt": "2026-09-03T15:00:00Z",
    "adminNote": "GPS logs confirmed delivery of all items."
  },
  {
    "id": "RF005",
    "orderId": "ORD020",
    "userId": "USR009",
    "restaurantId": "R001",
    "amount": 767,
    "reason": "FOOD_DAMAGED",
    "description": "The biryani container was completely spilled — packaging was torn.",
    "status": "PROCESSING",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-07-10T14:30:00Z"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-07-10T16:00:00Z"
      },
      {
        "status": "APPROVED",
        "date": "2026-07-11T10:00:00Z"
      },
      {
        "status": "PROCESSING",
        "date": "2026-07-11T12:00:00Z",
        "note": "Refund is being processed to your payment method"
      }
    ],
    "createdAt": "2026-07-10T14:30:00Z",
    "updatedAt": "2026-07-11T12:00:00Z"
  },
  {
    "id": "RF006",
    "orderId": "ORD002",
    "userId": "USR001",
    "restaurantId": "R004",
    "amount": 331,
    "reason": "ORDER_NEVER_ARRIVED",
    "description": "Waited over 2 hours. Order marked delivered but nothing arrived.",
    "status": "COMPLETED",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-08-20T11:00:00Z"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-08-20T12:00:00Z"
      },
      {
        "status": "APPROVED",
        "date": "2026-08-21T09:00:00Z"
      },
      {
        "status": "PROCESSING",
        "date": "2026-08-21T10:00:00Z"
      },
      {
        "status": "COMPLETED",
        "date": "2026-08-22T09:00:00Z",
        "note": "Refund of ₹331 credited to your original payment method"
      }
    ],
    "createdAt": "2026-08-20T11:00:00Z",
    "updatedAt": "2026-08-22T09:00:00Z",
    "resolvedAt": "2026-08-22T09:00:00Z"
  },
  {
    "id": "RF007",
    "orderId": "ORD015",
    "userId": "USR007",
    "restaurantId": "R001",
    "amount": 732,
    "reason": "DUPLICATE_PAYMENT",
    "description": "Was charged twice for the same order. Please refund the duplicate payment.",
    "status": "COMPLETED",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-07-20T21:30:00Z"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-07-21T09:00:00Z"
      },
      {
        "status": "APPROVED",
        "date": "2026-07-21T14:00:00Z",
        "note": "Duplicate transaction confirmed"
      },
      {
        "status": "PROCESSING",
        "date": "2026-07-21T15:00:00Z"
      },
      {
        "status": "COMPLETED",
        "date": "2026-07-22T10:00:00Z",
        "note": "Duplicate charge of ₹732 refunded to your card"
      }
    ],
    "createdAt": "2026-07-20T21:30:00Z",
    "updatedAt": "2026-07-22T10:00:00Z",
    "resolvedAt": "2026-07-22T10:00:00Z"
  },
  {
    "id": "RF008",
    "orderId": "ORD018",
    "userId": "USR008",
    "restaurantId": "R008",
    "amount": 1029,
    "reason": "RESTAURANT_CANCELLED",
    "description": "Restaurant cancelled my order after I waited for an hour. No explanation given.",
    "status": "UNDER_REVIEW",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-09-04T20:00:00Z",
        "note": "Refund request submitted"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-09-05T09:00:00Z",
        "note": "We are reviewing your case"
      }
    ],
    "createdAt": "2026-09-04T20:00:00Z",
    "updatedAt": "2026-09-05T09:00:00Z"
  },
  {
    "id": "RF009",
    "orderId": "ORD014",
    "userId": "USR006",
    "restaurantId": "R002",
    "amount": 422,
    "reason": "MISSING_ITEM",
    "description": "2 vada pavs were missing from the order. Only the pav bhaji was delivered.",
    "status": "APPROVED",
    "timeline": [
      {
        "status": "PENDING",
        "date": "2026-09-03T19:45:00Z"
      },
      {
        "status": "UNDER_REVIEW",
        "date": "2026-09-04T09:00:00Z"
      },
      {
        "status": "APPROVED",
        "date": "2026-09-04T14:00:00Z",
        "note": "Missing items confirmed. Partial refund of ₹422 approved."
      }
    ],
    "createdAt": "2026-09-03T19:45:00Z",
    "updatedAt": "2026-09-04T14:00:00Z"
  }
];
