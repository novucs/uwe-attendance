{
  "targets": [
    {
      "target_name": "nfc_reader",
      "sources": [ "./app/nfc_reader/nfc.cpp" ],
      "cflags": ["-Wall", "-std=c++11"],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")",
        "<!(node -e \"require('streaming-worker-sdk')\")"
      ]
    }
  ]
}
