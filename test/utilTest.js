module.exports = {
    categories : function() {
        return [
                    { _id: "Electronics" },
                    { _id: "Phones", parent: "Electronics" },
                    { _id: "Laptops", parent: "Electronics" },
                    { _id: "Bacon" }
               ];   
    },
    products : function() {
        return [
                    {
                        name: "LG G4",
                        category: { _id: "Phones", ancestors: ["Electronics", "Phones"] },
                        price: { amount: 300, currency: "USD" }
                    },
                    {
                        _id: "000000000000000000000001",
                        name: "Asus Zenbook Prime",
                        category: { _id: "Laptops", ancestors: ["Electronics", "Laptops"] },
                        price: { amount: 2000, currency: "USD" }
                    },
                    {
                        name: "Flying Pigs Farm Posture Raised Pork Baicon",
                        category: { _id: "Bacon", ancestors: ["Bacon"] },
                        price: { amount: 20, currency: "USD" }
                    },
               ]; 
    },
    users: function() {
        return [{
                    profile: {
                        username: "vkarpov15",
                        picture: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xla1/v/t1.0-1/p160x160/12391414_10153438974354601_2980907897499251318_n.jpg?oh=49f74caf1e409e57fb3d0e67d0476b4d&oe=5787BE14&__gda__=1468954639_ba817a98a29ddc3bc8f0e23aa1ae6449"
                    },
                    data: {
                        oauth: "invalid",
                        cart: []
                    }
               }];    
    }
}