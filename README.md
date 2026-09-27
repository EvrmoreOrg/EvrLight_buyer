
# buyer.html - the simple buyer side of EvrLight

EvrLight is a technology which atomically trustlessly swaps EVR or an Evrmore asset (plus a
small amount of EVR) in exchange for Bitcoin Lightning payment

EvrLight serves as a bulletin board where sellers post offers to sell an Evrmore asset at 
their chosen price and quantity range. A buyer sees the sell offers and can choose to take an 
offer at a quantity within the range set by the seller. After a buyer communicates their 
desired to take a seller's offer and chooses the quantity they want to purchase, they are shown 
a lightning invoice as a QRCode. The buyer can scan the QRCode using any Lightning wallet to pay 
with Bitcoin or scan using Block Inc's CashApp to pay with Dollars. The purchased asset is then 
automatically delivered to them. Typically within 4 seconds the buyer receives notification that the 
contract transaction broadcast has appeared in the explorer's mempool. This is sufficient for 
small-value transactions. Final confirmation of the contract and sweep delivery transactions by 
miners typically takes just over 2 minutes. It is a simple process.

To be clear, the correct analogy for EvrLight is a farmer's market, not a stock exchange. All 
offers are "offer-to-sell" made by sellers. There are no "offer-to-buy" offers. In truth EvrLight 
allows every buyer to post one "price suggestion" for an asset but they serve only as 
informal price suggestions to sellers, and are not actionable offers.

Delivery of the purchased assets to the buyer deserve further explanation. The buyer.html
web page is static code which contains some default arguments and to which some arguments
can be supplied as query commands in the URL used to access the page. But the only argument
which must be supplied is the private key which serves as the buyer's identity. If the buyer
is a user of Nostr, then they already own a private/public keypair as their identity. They
can paste that private key into their Nostr apps and can do the same with buyer.html. But more
typically, for better security, they will be running a "NIP-07" browser extension which supplies
the private key signatures to their Nostr apps without needing to disclose their private key.
The buyer.html page will sense a NIP-07 extension if one is installed, and will automatically
use if without needing the buyer to enter their key. From the Nostr private key, a public
key and Evrmore address are calculated to which the buyer's purchases are sent. The buyer's
Nostr ID pivate key then also serves as the buyer's private wallet key for a single-address 
Evrmore wallet. Using the Nostr ID key as the buyer ID key sacrifices privacy for the purchase
transaction. But it has a corresponding advantage that sellers and relays can accumulate
reputation histories for good buyers, for whom special offers and discounts could be made
available. Moreover, relays may charge small one-time or per-month EvrLight registration fees
to prevent spam and denial-of-service attacks. A buyer using their Nostr ID key or any chosen
persistant key would only need to pay the fee once, while randomized buyers must pay each time.
For flexibility, the buyer's private ID key can also be chosen randomly or by way of a remote 
Nostr "NIP-46" bunker, and the buyer may specify the destination address for his purchase 
deliveries to be any address they prefer.

EvrLight is designed to be quite robust against a variety of errors. Settlment of the 
invoice in which the buyer pays for the assets is delayed until delivery of the assests
is confirmed on-chain. If any part of the process fails, the invoice is cancelled and
payment is never accepted from the buyer.

Buyer.html will soon be made available also as a headless Node.js module. This will make
it easy to embed EvrLight buyer functionality into other applications which integrate
EvrLight into their UI in any fashion they prefer.

