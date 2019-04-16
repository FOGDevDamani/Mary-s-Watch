//
//  Renter.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/12/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase

protocol DocumentSerializable {
  init?(dictionary:[String:Any])
}

class Renter {
  var firstName: String
  var lastName: String
  var email: String
  var cellPhone: String
  var address: String
  var state: String
  var city: String
  var zipcode: String
  var county: String
  var username: String
  var password: String
	
	init(firstName: String, lastName: String, email: String, cellPhone: String, address: String, state: String, city: String, zipcode: String, county: String, username: String, password: String) {
		self.firstName = firstName
		self.lastName = lastName
		self.email = email
		self.cellPhone = cellPhone
		self.address = address
		self.state = state
		self.city = city
		self.zipcode = zipcode
		self.county = county
		self.username = username
		self.password = password
	}
	
	convenience init?(dictionary: [String : Any]) {
		guard let firstName = dictionary["First Name"] as? String,
			let lastName = dictionary["Last Name"] as? String,
			let email = dictionary["Email"] as? String,
			let cellPhone = dictionary["Cell Phone"] as? String,
			let address = dictionary["Address"] as? String,
			let state = dictionary["State"] as? String,
			let city = dictionary["City"] as? String,
			let zip = dictionary["Zipcode"] as? String,
			let county = dictionary["County"] as? String,
			let userName = dictionary["Username"] as? String,
			let password = dictionary["Password"] as? String else { return nil }
		
		self.init(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zipcode: zip, county: county, username: userName, password: password)
	}
	
  var dictionary:[String : Any] {
    return [
      "First Name": firstName,
      "Last Name": lastName,
      "Email": email,
      "Cell Phone": cellPhone,
      "Address": address,
      "State": state,
      "City": city,
      "Zipcode": zipcode,
      "County": county,
      "Username": username,
      "Password": password
    ]
  }
  
}


