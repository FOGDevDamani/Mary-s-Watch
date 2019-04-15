//
//  OwnersCustomerDisplayController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase


class OwnersCustomerDisplayController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
  
  var ownerCustomerReference: CollectionReference!
  var ownerCustomerArray = [OwnerCustomers]()
  
    @IBOutlet weak var ownerCustomerView: UICollectionView!
  @IBOutlet weak var ownerManageMyAccountView: UIView!
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    loadOwnerCustomerData()
  }

    override func viewDidLoad() {
        super.viewDidLoad()
      ownerCustomerReference = Firestore.firestore().collection("User").document("Owner").collection("MyCustomers")
    }

  func loadOwnerCustomerData() {
    ownerCustomerReference.addSnapshotListener { (snapshot, error) in
      if error != nil {
        print("\(String(describing: error?.localizedDescription))")
        return
      } else {
        guard let snapshot = snapshot else {return}
        let ownerCustomerData = snapshot.documents.compactMap({OwnerCustomers(dictionary: $0.data())})
        self.ownerCustomerArray = ownerCustomerData
        DispatchQueue.main.async {
          self.ownerCustomerView.reloadData()
        }
      }
    }
  }
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return ownerCustomerArray.count
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let identifier = "OwnerCustomerViewCell"
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: identifier, for: indexPath)
    
    let ownerCustomer = ownerCustomerArray[indexPath.row]
    let fullTitle = "\(ownerCustomer.firstName) \(ownerCustomer.lastName)"
    
    return cell
  }

    
  @IBAction func showManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = false
  }
  @IBAction func closeManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  @IBAction func dismissManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  
  

}
