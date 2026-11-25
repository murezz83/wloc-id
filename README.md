<p align="center">
  <img src="wloc.jpg" width="144" />
</p>

> - **Scope of impact:** There has been a large number of reports on iOS 16 / 18 / 26, with some devices only experiencing the problem after restarting; iOS 27 beta 6 and above have been blocked at the system level for some time.
> - **Self-check:** Settings → General → About → Certificate Trust Settings, check the "Trusted Assets" version.
>   - **≤1013:** Still usable. Please do not reboot or upgrade the system, and immediately add blocking rules to your router/proxy: `mesu.apple.com`, `gdmf.apple.com`, `appldnld.apple.com` to prevent trusted assets from updating to 1014.
>   - **1014:** Affected. The only solution is to restore factory settings (erase all content and settings), and before reactivation and the first internet connection, add the above blocking rule to your router/proxy to keep trusted assets on the old factory version, and then keep the blocking online. If the default version is still 1014 after the restore, there is no solution.
> - **There are currently no other bypass methods:** The verification occurs within the device's `locationd`/`trustd` settings, and changing proxy tools, soft routers, or transparent gateway proxies are ineffective; apart from restoring factory settings, there is currently no solution for non-jailbroken devices (jailbroken devices can restore the old pinning rule base).
> - **Alternative solution:** Developer location simulation channel (Developer Mode + DVT location simulation, such as the open-source tool `pymobiledevice3`), which does not rely on MITM and is not affected by this blocking.
