//
//  RenterEditProfileController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/9/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class RenterEditProfileController: UIViewController, UITextFieldDelegate {

  @IBOutlet weak var editRenterFirstName: UITextField!
  @IBOutlet weak var editRenterLastName: UITextField!
  @IBOutlet weak var editRenterEmail: UITextField!
  @IBOutlet weak var editRenterCellphone: UITextField!
  @IBOutlet weak var editRenterAddress: UITextField!
  @IBOutlet weak var editRenterState: UITextField!
  @IBOutlet weak var editRenterCity: UITextField!
  @IBOutlet weak var editRenterZipcode: UITextField!
  @IBOutlet weak var editRenterCounty: UITextField!
  @IBOutlet weak var editRenterUsername: UITextField!
  @IBOutlet weak var editRenterPassword: UITextField!
  @IBOutlet weak var editRenterConfirmPassword: UITextField!
  
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // Do any additional setup after loading the view.
    configureTextFields()
    configureTapGesture()
  }
  
  func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(RenterEditProfileController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  func configureTextFields() {
    editRenterFirstName.delegate = self
    editRenterLastName.delegate = self
    editRenterEmail.delegate = self
    editRenterCellphone.delegate = self
    editRenterAddress.delegate = self
    editRenterState.delegate = self
    editRenterCity.delegate = self
    editRenterZipcode.delegate = self
    editRenterCounty.delegate = self
    editRenterUsername.delegate = self
    editRenterPassword.delegate = self
    editRenterConfirmPassword.delegate = self
  }
  
  @IBAction func dismissEditController(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  
  
  
  @IBAction func updateRenter(_ sender: Any) {
    guard let email = editRenterEmail.text, editRenterEmail.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
      enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidEmailAlert, animated: true, completion: nil)
      return}
    guard let password = editRenterPassword.text, editRenterPassword.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
      enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidPasswordAlert, animated: true, completion: nil)
      return}
    guard let username = editRenterUsername.text, editRenterUsername.text?.count != 0, isUsernameValid(username: username) != false  else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
      enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidUsernameAlert, animated: true, completion: nil)
      return }
    guard let firstName = editRenterFirstName.text, editRenterFirstName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let lastName = editRenterLastName.text, editRenterLastName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    guard let cellPhone = editRenterCellphone.text, editRenterCellphone.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let address = editRenterAddress.text, editRenterAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let state = editRenterState.text, editRenterState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let city = editRenterCity.text, editRenterCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let zip = editRenterZipcode.text, editRenterZipcode.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let county = editRenterCounty.text, editRenterCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    let newEditRenter = Renter(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: username, password: password)
    
    let renterEditProfileReference = Firestore.firestore().collection("User").document("Renter")
    
    if editRenterConfirmPassword.text == editRenterPassword.text {
      
      renterEditProfileReference.setData(newEditRenter.dictionary) { (error) in
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
        self.editRenterPassword.text = ""
        self.editRenterConfirmPassword.text = ""
      }))
      self.present(passwordsDontMatchAlert, animated: true, completion: nil)
    }
  }
  
}

extension RenterEditProfileController {
  
  func textfieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == editRenterFirstName {
      editRenterLastName.becomeFirstResponder()
    } else if textField == editRenterLastName {
      editRenterEmail.becomeFirstResponder()
    } else if textField == editRenterEmail {
      editRenterCellphone.becomeFirstResponder()
    } else if textField == editRenterCellphone {
      editRenterAddress.becomeFirstResponder()
    } else if textField == editRenterAddress {
      editRenterState.becomeFirstResponder()
    } else if textField == editRenterState {
      editRenterCity.becomeFirstResponder()
    } else if textField == editRenterCity {
      editRenterZipcode.becomeFirstResponder()
    } else if textField == editRenterZipcode {
      editRenterCounty.becomeFirstResponder()
    } else if textField == editRenterCounty {
      editRenterUsername.becomeFirstResponder()
    } else if textField == editRenterUsername {
      editRenterPassword.becomeFirstResponder()
    } else if textField == editRenterPassword {
      editRenterConfirmPassword.becomeFirstResponder()
    } else {
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
  
  
    

  


