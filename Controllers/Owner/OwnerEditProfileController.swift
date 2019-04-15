//
//  OwnerEditProfileController.swift
//  maryswatch
//
//  Created by Damani Turner on 5/24/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase



class OwnerEditProfileController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var typeOfOwnerTF: UITextField!
    @IBOutlet weak var firstNameTF: UITextField!
    @IBOutlet weak var lastNameTF: UITextField!
    @IBOutlet weak var emailTF: UITextField!
    @IBOutlet weak var cellPhoneTF: UITextField!
    @IBOutlet weak var addressTF: UITextField!
    @IBOutlet weak var stateTF: UITextField!
    @IBOutlet weak var cityTF: UITextField!
    @IBOutlet weak var zipCodeTF: UITextField!
    @IBOutlet weak var countyTF: UITextField!
    @IBOutlet weak var userNameTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
  @IBOutlet weak var confirmPasswordTF: UITextField!
  
  @IBOutlet weak var ownerScrollView: UIScrollView!
  
  override func viewDidLoad() {
        super.viewDidLoad()
      configureTextFields()
      configureTapGesture()
    }
  
  private func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(OwnerEditProfileController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  @objc func keyboardWillChange(notification: Notification) {
    guard let keyboardRect = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else {
      return
    }
    
    let keyboardViewEndFrame = view.convert(keyboardRect, to: view.window)
    
    if notification.name == UIResponder.keyboardWillShowNotification || notification.name == UIResponder
      .keyboardWillChangeFrameNotification {
      ownerScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
    } else {
      ownerScrollView.contentInset = UIEdgeInsets.zero
    }
  }
  
  private func configureTextFields() {
    typeOfOwnerTF.delegate = self
    firstNameTF.delegate = self
    lastNameTF.delegate = self
    emailTF.delegate = self
    cellPhoneTF.delegate = self
    addressTF.delegate = self
    stateTF.delegate = self
    cityTF.delegate = self
    zipCodeTF.delegate = self
    countyTF.delegate = self
    userNameTF.delegate = self
    passwordTF.delegate = self
    confirmPasswordTF.delegate = self
  }
  
  @IBAction func dismissOwnerEditController(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  
    @IBAction func saveSettings(_ sender: Any) {
      guard let email = emailTF.text, emailTF.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
        enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(enterValidEmailAlert, animated: true, completion: nil)
        return}
      
      guard let password = passwordTF.text, passwordTF.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
        enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(enterValidPasswordAlert, animated: true, completion: nil)
        return}
      
      guard let username = userNameTF.text, userNameTF.text?.count != 0, isUsernameValid(username: username) != false  else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
        enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(enterValidUsernameAlert, animated: true, completion: nil)
        return }
      
      guard let typeOfOwner = typeOfOwnerTF.text, typeOfOwnerTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let firstName = firstNameTF.text, firstNameTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let lastName = lastNameTF.text, lastNameTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return  }
      
      guard let cellPhone = cellPhoneTF.text, cellPhoneTF.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let address = addressTF.text, addressTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let state = stateTF.text, stateTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let city = cityTF.text, cityTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let zip = zipCodeTF.text, zipCodeTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
      guard let county = countyTF.text, countyTF.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
        return }
      
		let newEditOwner = Owner(typeOfOwner: typeOfOwner, firstName: firstName, lastName: lastName, email: email, cellphone: cellPhone, address: address, state: state, city: city, zipcode: zip, county: county, username: username, password: password)
      
      let newEditOwnerReference = Firestore.firestore().collection("User").document("Owner")
      
      
      if confirmPasswordTF.text == passwordTF.text {
        
        newEditOwnerReference.setData(newEditOwner.dictionary) { (error) in
          if let error = error {
            print("Unable to create user: \(error.localizedDescription)")
          } else {
            print("User created")
          }
        }
        
        let passwordsDontMatchAlert = UIAlertController(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", preferredStyle: .alert)
        passwordsDontMatchAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
          self.passwordTF.text = ""
          self.confirmPasswordTF.text = ""
        }))
        self.present(passwordsDontMatchAlert, animated: true, completion: nil)
      }
      
      
      
      
  }
  
      
}
    

extension OwnerEditProfileController {

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == firstNameTF {
            lastNameTF.becomeFirstResponder()
        } else if textField == lastNameTF {
            emailTF.becomeFirstResponder()
        } else if textField == emailTF {
            cellPhoneTF.becomeFirstResponder()
        } else if textField == cellPhoneTF {
            addressTF.becomeFirstResponder()
        } else if textField == addressTF {
            stateTF.becomeFirstResponder()
        } else if textField == stateTF {
            cityTF.becomeFirstResponder()
        } else if textField == cityTF {
            zipCodeTF.becomeFirstResponder()
        } else if textField == zipCodeTF {
            countyTF.becomeFirstResponder()
        } else if textField == countyTF {
            userNameTF.becomeFirstResponder()
        } else if textField == userNameTF {
            passwordTF.becomeFirstResponder()
        } else if textField == passwordTF {
            confirmPasswordTF.becomeFirstResponder()
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
    
   

























