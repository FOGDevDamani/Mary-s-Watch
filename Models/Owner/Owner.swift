//
//  Owner.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/12/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase

class Owner
{
  var typeOfOwner: String
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
  
	init(typeOfOwner: String, firstName: String, lastName: String, email: String, cellphone: String, address: String, state: String, city: String, zipcode: String, county: String, username: String, password: String)
	{
		self.typeOfOwner = typeOfOwner
		self.firstName = firstName
		self.lastName = lastName
		self.email = email
		self.cellPhone = cellphone
		self.address = address
		self.state = state
		self.city = city
		self.zipcode = zipcode
		self.county = county
		self.username = username
		self.password = password
	}
	
	convenience init?(dictionary: [String : Any])
	{
		guard let typeOfCompany = dictionary["Type of Company"] as? String,
			let firstName = dictionary["First Name"] as? String,
			let lastName = dictionary["Last Name"] as? String,
			let email = dictionary["Email"] as? String,
			let cellPhone = dictionary["Cell Phone"] as? String,
			let address = dictionary["Address"] as? String,
			let state = dictionary["State"] as? String,
			let city = dictionary["City"] as? String,
			let zip = dictionary["Zipcode"] as? String,
			let county = dictionary["County"] as? String,
			let username = dictionary["Username"] as? String,
			let password = dictionary["Password"] as? String else { return nil }
		
		self.init(typeOfOwner: typeOfCompany, firstName: firstName, lastName: lastName, email: email, cellphone: cellPhone, address: address, state: state, city: city, zipcode: zip, county: county, username: username, password: password)
	}
	
	var dictionary:[String:Any]
	{
		return [
			"Type of Company": typeOfOwner,
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



