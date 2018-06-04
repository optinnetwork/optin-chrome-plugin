function uploadToIPFS(data, onAfterUpload) {
    const ipfs = IpfsApi('ipfs.infura.io', 5001, {protocol: 'https'});
    const buf = buffer.Buffer(data);
    ipfs.files.add(buf, (err, result) => {
      if(err) {
        console.error(err);
        return;
      }
      
      onAfterUpload(result[0].hash);      
    });
  }