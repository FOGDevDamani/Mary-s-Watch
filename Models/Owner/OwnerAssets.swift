//
//  OwnerAssets.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/12/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import Foundation
import Firebase

struct OwnerAssets {
  var typeOfProperty: String
  var address: String
  var state: String
  var city: String
  var zip: String
  var county: String
  
  var dictionary:[String:Any] {
    return [
      "Type of Property": typeOfProperty,
      "Address": address,
      "State": state,
      "City": city,
      "ZipCode": zip,
      "County": county,
    ]
  }
}

extension OwnerAssets: DocumentSerializable {
  init?(dictionary: [String : Any]) {
    guard let typeOfProperty = dictionary["Type of Property"] as? String,
      let address = dictionary["Address"] as? String,
      let state = dictionary["State"] as? String,
      let city = dictionary["City"] as? String,
      let zip = dictionary["Zipcode"] as? String,
      let county = dictionary["County"] as? String else { return nil }
    
    self.init(typeOfProperty: typeOfProperty, address: address, state: state, city: city, zip: zip, county: county)
  }
}
