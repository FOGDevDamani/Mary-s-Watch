//
//  RenterProfileDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/9/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class RenterProfileDetailsController: UIViewController {

  @IBOutlet weak var renterNameLabel: UILabel!
  @IBOutlet weak var renterPhoneLabel: UILabel!
  @IBOutlet weak var renterEmailLabel: UILabel!
  @IBOutlet weak var typeOfUserLabel: UILabel!
  @IBOutlet weak var renterAddressLabel: UILabel!
  @IBOutlet weak var renterManageMyAccount: UIButton!
  @IBOutlet weak var renterManageMyAccountView: UIView!
  
  var docReference: DocumentReference!
  var renterListener: ListenerRegistration!
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    renterListener = docReference.addSnapshotListener { (docSnapshot, error) in
      guard let docSnapshot = docSnapshot, docSnapshot.exists else{ return }
      guard  let myData = docSnapshot.data() else {
        print("Document data is empty")
        return
      }
      guard let firstName = myData["First Name"] as? String else { return }
      guard let lastname = myData["Last Name"] as? String else { return }
      let renterName = firstName + lastname
      guard let renterPhone = myData["Cell Phone"] as? String else { return }
      guard let renterEmail = myData["Email"] as? String else { return }
      guard let address = myData["Address"] as? String else { return }
      guard let city = myData["City"] as? String else { return }
      guard let state = myData["State"] as? String else {  return }
      guard let zipCode = myData["Zipcode"] as? String else { return }
      let renterAddress = "\(address)  \(city) \(state),  \(zipCode)"
      
      self.renterNameLabel.text = renterName
      self.renterPhoneLabel.text = renterPhone
      self.renterEmailLabel.text = renterEmail
      self.typeOfUserLabel.text = "Renter"
      self.renterAddressLabel.text = renterAddress
    }
  }
  
    override func viewWillDisappear(_ animated: Bool) {
      super.viewWillDisappear(animated)
      renterListener.remove()
    }
  
  @IBAction func showManageMyAccount(_ sender: Any) {
    renterManageMyAccountView.isHidden = false
  }
  
  @IBAction func dismissRenterAccountView(_ sender: Any) {
   renterManageMyAccountView.isHidden = true
  }
  
  @IBAction func dismissManageMyAccounView(_ sender: Any) {
    renterManageMyAccountView.isHidden = true
  }
  
    override func viewDidLoad() {
        super.viewDidLoad()

        docReference = Firestore.firestore().collection("User").document("Renter")
      }
    

  
}
