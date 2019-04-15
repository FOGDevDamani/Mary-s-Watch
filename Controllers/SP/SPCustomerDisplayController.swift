//
//  SPCustomerDisplayController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/11/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class SPCustomerDisplayController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate {
  
  var spCustomerReference: CollectionReference!
  var spCustomerArray = [SPCustomers]()
  
  @IBOutlet weak var spCustomerView: UICollectionView!
  @IBOutlet weak var spManageMyAccount: UIButton!
  @IBOutlet weak var spManageMyAccountView: UIView!
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    loadCustomerData()
  }
  
  
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
      spCustomerReference = Firestore.firestore().collection("User").document("Service Provider").collection("MyCustomer")
    }
  
  func loadCustomerData() {
    spCustomerReference.addSnapshotListener { (snapshot, error) in
      if error != nil {
        print("\(String(describing: error?.localizedDescription))")
        return
      } else {
        guard let snapshot = snapshot else {return}
        let customerData = snapshot.documents.compactMap({SPCustomers(dictionary: $0.data())})
        self.spCustomerArray = customerData
        DispatchQueue.main.async {
          self.spCustomerView.reloadData()
        }
      }
    }
  }
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return spCustomerArray.count
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let identifier = "SPCustomersCell"
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: identifier, for: indexPath) as! SPCustomersCell
    
    let spCustomer = spCustomerArray[indexPath.item]
    let fullTitle = "\(spCustomer.firstName) \(spCustomer.lastName)"
    
    cell.spNameAndTitle.titleLabel?.text = fullTitle
    
    return cell
  }
  
  @IBAction func closeManageMyAccount(_ sender: Any) {
    spManageMyAccountView.isHidden = true
  }
  
  @IBAction func dismissManageMyAccount(_ sender: Any) {
    spManageMyAccountView.isHidden = true
  }
  
  @IBAction func showManageMyAccount(_ sender: Any) {
    spManageMyAccountView.isHidden = false
  }
  

}
