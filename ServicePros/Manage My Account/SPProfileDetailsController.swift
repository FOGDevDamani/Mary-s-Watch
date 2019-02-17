//
//  SPProfileDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SPProfileDetailsController: UIViewController {
  
  @IBOutlet weak var spManageMyAccount: UIButton!
  @IBOutlet weak var spManageMyAccountView: UIView!
  
  @IBOutlet weak var spProfileName: UILabel!
  @IBOutlet weak var spProfilePhoneNumber: UILabel!
  @IBOutlet weak var spProfileEmail: UILabel!
  @IBOutlet weak var spProfileTitle: UILabel!
  @IBOutlet weak var spProfileAddress: UILabel!
  
  var docReference: DocumentReference!
  var spListener: ListenerRegistration!
  
  
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
      
      docReference = Firestore.firestore().collection("User").document("Service Provider")
    }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    spListener = docReference.addSnapshotListener { (docSnapshot, error) in
      guard let docSnapshot = docSnapshot, docSnapshot.exists else {return}
      guard let spData = docSnapshot.data() else {
        print("SP data is empty")
        return
      }
      guard let spFirstName = spData["First Name"] as? String else {return}
      guard let spLastname = spData["Last Name"] as? String else { return }
      let spName = spFirstName + spLastname
      guard let spPhone = spData["Cell Phone"] as? String else { return }
      guard let spEmail = spData["Email"] as? String else { return }
      guard let spAddress = spData["Address"] as? String else { return }
      guard let spCity = spData["City"] as? String else { return }
      guard let spState = spData["State"] as? String else {  return }
      guard let spZipCode = spData["Zipcode"] as? String else { return }
      let spWholeAddress = "\(spAddress)  \(spCity) \(spState),  \(spZipCode)"
      
      self.spProfileName.text = spName
      self.spProfilePhoneNumber.text = spPhone
      self.spProfileEmail.text = spEmail
      self.spProfileTitle.text = "Service Provider"
      self.spProfileAddress.text = spWholeAddress
    }
  }
  
  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    spListener.remove()
  }
  
  
    
  @IBAction func closeSPMyAccountView(_ sender: Any) {
    spManageMyAccountView.isHidden = true
    
  }
  
  @IBAction func dismissSPAccountView(_ sender: Any) {
    spManageMyAccountView.isHidden = true
    
  }
  
  @IBAction func showSPManageMyAccount(_ sender: Any) {
    spManageMyAccountView.isHidden = true
  }
  

}
