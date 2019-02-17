//
//  SPEditProfileController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SPEditProfileController: UIViewController, UITextFieldDelegate {
  
  @IBOutlet weak var spProfileTypeOfCompany: UITextField!
  @IBOutlet weak var spEditFirstName: UITextField!
  @IBOutlet weak var spEditLastName: UITextField!
  @IBOutlet weak var spEditEmail: UITextField!
  @IBOutlet weak var spEditCellphone: UITextField!
  @IBOutlet weak var spEditAddress: UITextField!
  @IBOutlet weak var spEditState: UITextField!
  @IBOutlet weak var spEditCity: UITextField!
  @IBOutlet weak var spEditZipcode: UITextField!
  @IBOutlet weak var spEditCounty: UITextField!
  @IBOutlet weak var spEditUsername: UITextField!
  @IBOutlet weak var spEditPassword: UITextField!
  @IBOutlet weak var spEditConfirmPassword: UITextField!
  
    override func viewDidLoad() {
        super.viewDidLoad()

        configureTapGesture()
        configureTextFields()
    }
  
  func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(SPEditProfileController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  func configureTextFields() {
    spProfileTypeOfCompany.delegate = self
    spEditFirstName.delegate = self
    spEditLastName.delegate = self
    spEditEmail.delegate = self
    spEditCellphone.delegate = self
    spEditAddress.delegate = self
    spEditState.delegate = self
    spEditCity.delegate = self
    spEditZipcode.delegate = self
    spEditCounty.delegate = self
    spEditUsername.delegate = self
    spEditPassword.delegate = self
    spEditConfirmPassword.delegate = self
  }
  
  
  @IBAction func dismissSPEditProfile(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  
  
  @IBAction func editSPProfile(_ sender: Any) {
    guard let email = spEditEmail.text, spEditEmail.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
      enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidEmailAlert, animated: true, completion: nil)
      return}
    
    guard let password = spEditPassword.text, spEditPassword.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
      enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidPasswordAlert, animated: true, completion: nil)
      return}
    
    guard let username = spEditUsername.text, spEditUsername.text?.count != 0, isUsernameValid(username: username) != false  else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
      enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidUsernameAlert, animated: true, completion: nil)
      return }
    
    guard let typeOfOwner = spProfileTypeOfCompany.text, spProfileTypeOfCompany.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let firstName = spEditFirstName.text, spEditFirstName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let lastName = spEditLastName.text, spEditLastName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    
    guard let cellPhone = spEditCellphone.text, spEditCellphone.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let address = spEditAddress.text, spEditAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let state = spEditState.text, spEditState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let city = spEditCity.text, spEditCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let zip = spEditZipcode.text, spEditZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    guard let county = spEditCounty.text, spEditCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    let newEditSP = ServiceProvider(typeOfCompany: typeOfOwner, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: username, password: password)
    
    let spEditProfileReference = Firestore.firestore().collection("User").document("Service Provider")
    
    if spEditConfirmPassword.text == spEditPassword.text {
      
      spEditProfileReference.setData(newEditSP.dictionary) { (error) in
        if let error = error {
          print("Unable to create user: \(error.localizedDescription)")
        } else {
          print("User created")
        }
      }
      
      let profileEditedAlert = UIAlertController(title: "Profile Edited", message: "Your profile has successfully been edited.", preferredStyle: .alert)
      profileEditedAlert.addAction((UIAlertAction(title: "OK", style: .default, handler: { (action) in
        self.dismiss(animated: true, completion: nil)
      })))
      self.present(profileEditedAlert, animated: true, completion: nil)
      
      let passwordsDontMatchAlert = UIAlertController(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", preferredStyle: .alert)
      passwordsDontMatchAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
        self.spEditPassword.text = ""
        self.spEditConfirmPassword.text = ""
      }))
      self.present(passwordsDontMatchAlert, animated: true, completion: nil)
    }
    
    
    
    
  }

}

extension SPEditProfileController {
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == spEditFirstName {
      spEditLastName.becomeFirstResponder()
    } else if textField == spEditLastName {
      spEditEmail.becomeFirstResponder()
    } else if textField == spEditEmail {
      spEditCellphone.becomeFirstResponder()
    } else if textField == spEditCellphone {
      spEditAddress.becomeFirstResponder()
    } else if textField == spEditAddress {
      spEditState.becomeFirstResponder()
    } else if textField == spEditState {
      spEditCity.becomeFirstResponder()
    } else if textField == spEditCity {
      spEditZipcode.becomeFirstResponder()
    } else if textField == spEditZipcode {
      spEditCounty.becomeFirstResponder()
    } else if textField == spEditCounty {
      spEditUsername.becomeFirstResponder()
    } else if textField == spEditUsername {
      spEditPassword.becomeFirstResponder()
    } else if textField == spEditPassword {
      spEditConfirmPassword.becomeFirstResponder()
    } else  {
      textField.resignFirstResponder()
    }
    
    return true
  }
  
  func isValidEmail(emailID: String) -> Bool {
    let emailRegEx = "[A-z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
    let emailTest = NSPredicate(format: "SELF MATCHES %@", emailRegEx)
    return emailTest.evaluate(with: emailID)
  }
  
  func isPasswordValid(password: String) -> Bool {
    let passwordRegEx = "^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[a-zA-z0-9]{8,}"
    let passwordTest = NSPredicate(format: "SELF MATCHES %@", passwordRegEx)
    return passwordTest.evaluate(with: password)
  }
  
  func isUsernameValid(username: String) -> Bool {
    let usernameRegEx = "^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[a-zA-z0-9]{8,}"
    let usernameTest = NSPredicate(format: "SELF MATCHES %@", usernameRegEx)
    return usernameTest.evaluate(with: username)
  }
  
  func isPhoneNumberValid(cellPhone: String) -> Bool {
    let cellPhoneRegEx = "^\\d{3}-\\d{3}-\\d{4}$"
    let cellPhoneTest = NSPredicate(format: "SELF MATCHES %@", cellPhoneRegEx)
    return cellPhoneTest.evaluate(with:cellPhone)
  }

  
}
