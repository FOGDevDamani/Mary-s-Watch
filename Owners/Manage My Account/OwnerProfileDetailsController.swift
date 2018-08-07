//
//  OwnerProfileDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/5/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseFirestore

class OwnerProfileDetailsController: UIViewController {

    @IBOutlet weak var ownerDIsplayNameField: UILabel!
    @IBOutlet weak var ownerDisplayPhoneField: UILabel!
    @IBOutlet weak var ownerDisplayEmailField: UILabel!
    @IBOutlet weak var ownerDisplayAddressField: UILabel!
    
    var reference: DocumentReference!
    var nameListener: ListenerRegistration!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        reference = Firestore.firestore().document("User/qYddEMg9j2PxaxKocb3D")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        nameListener = reference.addSnapshotListener { (docSnapshot, error) in
            guard let docSnapshot = docSnapshot, docSnapshot.exists else {return}
            let profileData = docSnapshot.data()
            let firstName = profileData["firstName"] as? String ?? ""
            let lastName = profileData["lastName"] as? String ?? ""
            let currentName = "\(firstName) \(lastName)"
            let currentAddress = profileData["address"] as? String ?? ""
            let currentCity = profileData["city"] as? String ?? ""
            let currentState = profileData["state"] as? String ?? ""
            let currentZipcode = profileData["zipCode"] as? String ?? ""
            let fullAddress = "\(currentAddress) \(currentCity) \(currentState), \(currentZipcode)"
            let email = profileData["email"] as? String ?? ""
            let phoneNumber = profileData["cellPhone"] as? String ?? ""
            self.ownerDIsplayNameField.text = currentName
            self.ownerDisplayAddressField.text = fullAddress
            self.ownerDisplayEmailField.text = email
            self.ownerDisplayPhoneField.text = phoneNumber
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        nameListener.remove()
    }
  
}
