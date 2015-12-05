Simon Fraser University CMPT 354 Database System I GROUP 08
Warehouse Web Application README

# TABLE OF CONTENTS
- Introduction
- General Function Descriptions
- List of Bugs
- Team Members


# Introduction
We have designed an application for music store that will assist in online shopping and warehouse managing for a general workplace. 
It features authentication, ordering system, return system and sale reports for users to manipulate. 
Our project is running on AngularJs and Javascript. Our user interface is implemented with Bootstrap.


# General Function Descriptions
- Authentication:
The login screen is implemented using Bootstrap. Be able to login username and password and create an account.
By creating an account, the users need to enter their username, password, full name, address ,and phone number.
After registeration, the users would be allow to login with the account that they just create.

- Ordering system: 
After logging in, the customers are able to seach for an item by using any combination of title, lead singer, and category, the screen would dynamically display the results.
Clicking the Plus button after customers find out items the users like. The customers can click shopping cart in order to completing the order and make payment. 

- Returning system:
The return system is under the clerk section. Only clerk and manager are allow to use.
The user be able to return products to the store by correct receipt. Clerks are able to enter receipt, UPC number, and quantity in order to make reutrn. After the returning, the screen would show up the credit number and total refund to the clerks.

- Stock and Delivery:
The stock and delivery are unber the manager section.
The manager is able to update the number of stock and find the delivery time by entering the UPC number 

- Sale reports:
The sale reports is under the manager section.
the manager is able to find the daily report by section a specific date.


# List of known bugs
- Accept "abc" as phone number during user registration. 
- Return an item allows me to put in negative quantity number. 
- Even if the search results only contains 1 page, the page 1,2,3,4,5 tabs are still shown. 


# Member of Team
- Ryan Mitts
- Andrew Coccimiglio
- Ariana Williams
- Mitchell Hole
- Yu-Chun Lin

