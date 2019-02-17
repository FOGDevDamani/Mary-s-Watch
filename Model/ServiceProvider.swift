//
//  ServiceProvider.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/12/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase

struct ServiceProvider {
  var typeOfCompany: String
  var firstName: String
  var lastName: String
  var email: String
  var cellPhone: String
  var address: String
  var state: String
  var city: String
  var zip: String
  var county: String
  var userName: String
  var password: String
  
  var dictionary:[String:Any] {
    return [
      "Type of Company": typeOfCompany,
      "First Name": firstName,
      "Last Name": lastName,
      "Email": email,
      "Cell Phone": cellPhone,
      "Address": address,
      "State": state,
      "City": city,
      "Zipcode": zip,
      "County": county,
      "Username": userName,
      "Password": password
    ]
  }
}

extension ServiceProvider: DocumentSerializable {
  init?(dictionary: [String : Any]) {
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
      let userName = dictionary["Username"] as? String,
      let password = dictionary["Password"] as? String else { return nil }
    
    self.init(typeOfCompany: typeOfCompany, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: userName, password: password)
  }
}
