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
  
}


