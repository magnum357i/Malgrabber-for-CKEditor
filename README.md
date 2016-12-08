# Malgrabber-for-CKEditor
Bu plugin ile MyAnimeList sitesinden herhangi bir anime veya manganın bilgilerini çekebilirsiniz.

## Ayarlar
#### Çerez Ayarları
**cookie_settings.php** dosyasını açın.

```php
$config["cookie_limit"] = "20";
```
Maksimum kullanma limiti. Bu limiti aşınca belirtilen süre kadar beklemek zorunda kalırsınız.

```php
$cookie_hours = 6;
```
Maksimum kullanma limiti aşıldıktan sonra beklenilen saat.

```php
$cookie_mins = 30;
```
Maksimum kullanma limiti aşıldıktan sonra beklenilen dakika.

#### Afiş Yükleme Ayarları
**image_settings.php** dosyasını açın.

```php
$config["image_max_size"] = "400";
```
Yüklenilen afişlerin en ve boy oranları için sınır değeri.

#### Link Oluşturma Ayarları
```php
$config[ "htaccess_enabled" ] = "off";
```
Htaccess yönlendirmesinin açılıp açılmayacağına karar verirsiniz. Bu ayarı aktifleştirdikten sonra create_htaccess dosyasını tarayıcıda açıp oluşturduğu htaccess.txt dosyasının içindeki komutları kök dizindeki .htaccess dosyasına eklemelisiniz.

```php
$config[ "https"            ] = "off";
```
Linklerin başına https protokolü eklenip eklenmeyeceğine karar verirsiniz.

# In English
With this plugin, you can get information of any anime or manga from MyAnimeList website.

## Settings
#### Cookie Settings
Open **cookie_settings.php** file.

```php
$config["cookie_limit"] = "15";
```
Maximum usage limit. If you exceed this limit, you will have to wait for the specified time.

```php
$cookie_hours = 2;
```
Expected hour(s) after exceeding the maximum usage limit.

```php
$cookie_mins = 0;
```
Expected min(s) after exceeding the maximum usage limit.

#### Poster Upload Settings
Open **image_settings.php** file.

```php
$config["image_max_size"] = "400";
```
Limit value for the width and height of the uploaded images.

#### Link Create Settings
```php
$config[ "htaccess_enabled" ] = "off";
```
You decide whether to turn on htaccess redirection. After activating this setting, open **create_htaccess** file in the browser and copy the commands in generated **htaccess.txt** file to **htaccess file** in the root directory.

```php
$config[ "https"            ] = "off";
```
You decide whether to add the https protocol per link.