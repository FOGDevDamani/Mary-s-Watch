//
//  OwnerCustomersController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/10/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class OwnerCustomersController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var ownerCustomerFirstName: UITextField!
    @IBOutlet weak var ownerCustomerLastName: UITextField!
    @IBOutlet weak var ownerCustomerEmail: UITextField!
    @IBOutlet weak var ownerCustomerAddress: UITextField!
    @IBOutlet weak var ownerCustomerState: UITextField!
    @IBOutlet weak var ownerCustomerCity: UITextField!
    @IBOutlet weak var ownerCustomerZipcode: UITextField!
    @IBOutlet weak var ownerCustomerCounty: UITextField!
    @IBOutlet weak var ownerCustomerCellPhone: UITextField!
    @IBOutlet weak var currentCustomer: UISwitch!
    @IBOutlet weak var pastCustomer: UISwitch!
    @IBOutlet weak var customerProspect: UISwitch!
  

    override func viewDidLoad() {
        super.viewDidLoad()

       
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
  
  
  @IBAction func dismissCustomerView(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  
    
    
    
    @IBAction func addCustomerSettings(_ sender: Any) {
      
      guard let firstName = ownerCustomerFirstName.text, ownerCustomerFirstName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a first name", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let lastName = ownerCustomerLastName.text, ownerCustomerLastName.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid last name", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let  email = ownerCustomerEmail.text, ownerCustomerEmail.text?.count != 0 else {  let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Plase enter a valid meail", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let address = ownerCustomerAddress.text, ownerCustomerAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid email", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let state = ownerCustomerState.text, ownerCustomerState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid state", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let city = ownerCustomerCity.text, ownerCustomerCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid city", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let zipCode = ownerCustomerZipcode.text, ownerCustomerZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid zipcode", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let county = ownerCustomerCounty.text, ownerCustomerCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "Please enter a valid county", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let cellPhone = ownerCustomerCellPhone.text, ownerCustomerCellPhone.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "please enter a valid cell phone number", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      let newOwnerCustomer = OwnerCustomers(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zipCode, county: county)
      
      let ownerCustomerReference = Firestore.firestore().collection("User").document("Owner").collection("MyCustomers")
      
      ownerCustomerReference.addDocument(data: newOwnerCustomer.dictionary) { (error) in
        if let error = error {
          print("Error creating team: \(error.localizedDescription)")
        } else {
          print("Customer Successfully created")
        }
      }
      
      let customerCreatedAlert = UIAlertController(title: "Your Customer Invited", message: "Invitation to join your customer has been sent", preferredStyle: .alert)
      customerCreatedAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
        self.dismiss(animated: true, completion: nil)
      }))
      self.present(customerCreatedAlert, animated: true, completion: nil)
      
    }

}

extension OwnerCustomersController {
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == ownerCustomerFirstName {
      ownerCustomerLastName.becomeFirstResponder()
    } else if textField == ownerCustomerLastName {
      ownerCustomerEmail.becomeFirstResponder()
    } else if textField == ownerCustomerEmail {
      ownerCustomerAddress.becomeFirstResponder()
    } else if textField == ownerCustomerAddress {
      ownerCustomerState.becomeFirstResponder()
    } else if textField == ownerCustomerState {
      ownerCustomerCity.becomeFirstResponder()
    } else if textField == ownerCustomerCity {
      ownerCustomerZipcode.becomeFirstResponder()
    } else if textField == ownerCustomerCounty{
      ownerCustomerZipcode.becomeFirstResponder()
    } else if textField == ownerCustomerZipcode {
      ownerCustomerCellPhone.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
}
