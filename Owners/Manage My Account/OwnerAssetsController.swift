//
//  OwnerAssetsController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class OwnerAssetsController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var ownerTypeOfProperty: UITextField!
    @IBOutlet weak var ownerPropertyAddress: UITextField!
    @IBOutlet weak var ownerPropertyState: UITextField!
    @IBOutlet weak var ownerPropertyCity: UITextField!
    @IBOutlet weak var ownerPropertyZipcode: UITextField!
    @IBOutlet weak var ownerPropertyCounty: UITextField!
    
    

    override func viewDidLoad() {
        super.viewDidLoad()

        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
  
  
  @IBAction func dismissAssetController(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
    
    
    @IBAction func addOwnerAsset(_ sender: Any) {
      guard let typeOfProperty = ownerTypeOfProperty.text, ownerTypeOfProperty.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a type of property", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let address = ownerPropertyAddress.text, ownerPropertyAddress.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a type of property", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let state = ownerPropertyState.text, ownerPropertyState.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a type of property", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let city = ownerPropertyCity.text, ownerPropertyCity.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a type of property", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let zipCode = ownerPropertyZipcode.text, ownerPropertyZipcode.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a type of property", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let county = ownerPropertyCounty.text, ownerPropertyCounty.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a type of property", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      let newOwnerAsset = OwnerAssets(typeOfProperty: typeOfProperty, address: address, state: state, city: city, zip: zipCode, county: county)
      
      let ownerAssetsReference = Firestore.firestore().collection("User").document("Service Provider").collection("MyAssets")
      
      ownerAssetsReference.addDocument(data: newOwnerAsset.dictionary) { (error) in
        if let error = error {
          print("Error creating team: \(error.localizedDescription)")
        } else {
          print("Team Successfully created")
        }
      }
      
      let assetCreatedAlert = UIAlertController(title: "Success", message: "Your asset has been added.", preferredStyle: .alert)
      assetCreatedAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
        self.dismiss(animated: true, completion: nil)
      }))
      self.present(assetCreatedAlert, animated: true, completion: nil)
    
  }
  
    
    

  
  
  
  
  
}

extension OwnerAssetsController {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == ownerTypeOfProperty {
      ownerPropertyAddress.becomeFirstResponder()
    } else if textField == ownerPropertyAddress {
      ownerPropertyState.becomeFirstResponder()
    } else if textField == ownerPropertyState {
      ownerPropertyCity.becomeFirstResponder()
    } else if textField == ownerPropertyCity {
      ownerPropertyZipcode.becomeFirstResponder()
    } else if textField == ownerPropertyZipcode {
      ownerPropertyCounty.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
}
