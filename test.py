import requests

url = "https://eolblxg3qe42qa0.m.pipedream.net/"
headers = {"Content-Type": "application/json"}
data = {
    "api_key":"6hhyw+gpg%xgl8oa4863wc6*!7ffpqm1rvtjcm@*so#vnujyvufed7!u%lrje4ikrkcggmmjsj$qie+b2hdyfk|inetl!uvj4wipzownl0vq5|%q|#q$ntx^cdiknl2",
    "dataset_key":"fgjc%xnezu^udptat8ibfsn+bw1mer%dv%ao?hnch+r9o!e$wzht@uj+ea7jgbbzfn8ptcp*qiw6oyt?pcmi!azvtckz+unyyqslsowakrvcbwv3v#i|ltqaf!920jej"
}

response = requests.post(url, json=data, headers=headers, auth=('au_master_prod_user', 'bScK@LMjTsVVa#E2PiUQrfEE'))
print(response.text)
